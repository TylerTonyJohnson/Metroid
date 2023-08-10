import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { VisorType, BeamType } from './enums';
import { get } from 'svelte/store';
import {
	isRendering,
	currentVisor,
	unlockedVisors,
	currentBeam,
	unlockedBeams,
	lookMovement,
	lookPosition,
	isLockable,
	isLocked,
	isScanning,
	scanProgress,
	currentDanger,
	currentAmmo,
	maxAmmo,
	capAmmo,
	readoutShow,
	isDebugMode,
	currentHealth,
	maxHealth,
	capHealth
} from './stores';
import { clamp, randomInt } from './math';
import { shootBeam, shootMissile, getLockMesh as getLockMesh, releaseLockMesh } from './scene';

let $currentVisor;
let $unlockedVisors;
let $unlockedBeams;
let $lookMovement;
let $isLocked;
let $isScanning;
let mouseTimer;

const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
const moveMaxX = 5;
const moveMaxY = 5;
const lookSpeedX = 5;
const lookSpeedY = 8;
const lockRotSpeed = 10;

const targetMatrix = new THREE.Matrix4();
const targetQuaternion = new THREE.Quaternion();
let lockTargetMesh = new THREE.Vector3(0, 0, 0);

export class PlayerController extends THREE.EventDispatcher {
	constructor(camera, cannonBody) {
		super();
		this.minPolarAngle = 0;
		this.maxPolarAngle = Math.PI;
		this.object = new THREE.Group();
		this.enabled = false; // Set this control as disabled until it's ready

		this.camera = camera;
		camera.rotation.y = Math.PI;
		this.object.add(this.camera);
		this.cannonBody = cannonBody; // Link the physics body to the controller

		this.strafeSpeed = 10; // Unused right now
		this.jumpSpeed = 20;
		this.maxJumps = 2;
		this.jumps = this.maxJumps;

		this.lockEvent = { type: 'lock' };
		this.unlockEvent = { type: 'unlock' };

		this.setupCannonBody();
		this.subscribeToStores();
		this.setupEventListeners();

		// Runtime
		this.moveForward = false; // Set movement booleans
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.moveDown = false;
		this.rotateLeft = false;
		this.rotateRight = false;

		this.inputVelocity = new THREE.Vector3();

		this.walkSpeed = 20;
		this.sprintSpeed = this.walkSpeed * 2;
		this.moveSpeed = this.walkSpeed;

		this.current = {
			isLeftMouse: false,
			isRightMouse: false,
			isMiddleMouse: false,
			movementX: 0,
			movementY: 0
		};
	}

	subscribeToStores() {
		unlockedVisors.subscribe((value) => {
			$unlockedVisors = value;
		});

		unlockedBeams.subscribe((value) => {
			$unlockedBeams = value;
		});

		lookMovement.subscribe((value) => {
			$lookMovement = value;
		});

		isLocked.subscribe((value) => {
			$isLocked = value;
		});

		isScanning.subscribe((value) => {
			$isScanning = value;
		});

		currentVisor.subscribe((value) => {
			$currentVisor = value;
		});
	}

	setupCannonBody() {
		const contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
		const upAxis = new CANNON.Vec3(0, 1, 0);
		this.cannonBody.addEventListener('collide', (event) => {
			const { contact } = event;

			// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
			// We do not yet know which one is which! Let's check.
			if (contact.bi.id === this.cannonBody.id) {
				// bi is the player body, flip the contact normal
				contact.ni.negate(contactNormal);
			} else {
				// bi is something else. Keep the normal as it is
				contactNormal.copy(contact.ni);
			}

			// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
			if (contactNormal.dot(upAxis) > 0.1) {
				// Use a "good" threshold value between 0 and 1 here!
				this.jumps = this.maxJumps;
			}
		});

		this.velocity = this.cannonBody.velocity;
	}

	setupEventListeners() {
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mousedown', this.onMouseDown);
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('pointerlockchange', this.onPointerlockChange);
		document.addEventListener('pointerlockerror', this.onPointerlockError);
		document.addEventListener('keydown', this.onKeyDown);
		document.addEventListener('keyup', this.onKeyUp);
	}

	dispose() {
		this.removeEventListeners();
	}

	removeEventListeners() {
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mousedown', this.onMouseDown);
		document.removeEventListener('mouseup', this.onMouseUp);
		document.removeEventListener('pointerlockchange', this.onPointerlockChange);
		document.removeEventListener('pointerlockerror', this.onPointerlockError);
		document.removeEventListener('keydown', this.onKeyDown);
		document.removeEventListener('keyup', this.onKeyUp);
	}

	lock() {
		document.body.requestPointerLock();
	}

	unlock() {
		document.exitPointerLock();
	}

	onPointerlockChange = () => {
		if (document.pointerLockElement) {
			this.dispatchEvent(this.lockEvent);
			this.isLocked = true;
			isRendering.set(true);
		} else {
			this.dispatchEvent(this.unlockEvent);
			this.isLocked = false;
			isRendering.set(false);
		}
	};

	onPointerlockError = () => {
		console.error('PointerLockControlsCannon: Unable to use Pointer Lock API');
	};

	update(timeElapsed) {
		if (this.enabled === false) {
			return;
		}
		this.updatePosition(timeElapsed);
		this.updateRotation(timeElapsed);
	}

	updatePosition(timeElapsed) {
		// Calculate total direction of new velocity relative to player
		this.inputVelocity.set(0, 0, 0);
		if (this.moveForward) {
			this.inputVelocity.add(new THREE.Vector3(0, 0, 1));
		}
		if (this.moveBackward) {
			this.inputVelocity.add(new THREE.Vector3(0, 0, -1));
		}
		if (this.moveLeft) {
			this.inputVelocity.add(new THREE.Vector3(1, 0, 0));
		}
		if (this.moveRight) {
			this.inputVelocity.add(new THREE.Vector3(-1, 0, 0));
		}
		if (this.moveUp) {
			this.inputVelocity.add(new THREE.Vector3(0, -1, 0));
		}
		if (this.moveDown) {
			this.inputVelocity.add(new THREE.Vector3(0, 1, 0));
		}

		// Scale and rotate velocity to world coordinates
		this.inputVelocity.multiplyScalar(this.moveSpeed * timeElapsed);
		this.inputVelocity.applyQuaternion(this.object.quaternion);

		// Add total new velocity to the physics body
		this.cannonBody.velocity.x += this.inputVelocity.x;
		this.cannonBody.velocity.z += this.inputVelocity.z;
		this.object.position.copy(this.cannonBody.position);
	}

	updateRotation(timeElapsed) {
		// Calculate target quaternion
		if ($isLocked) {
			targetMatrix.lookAt(lockTargetMesh, this.object.position, this.object.up);
			targetQuaternion.setFromRotationMatrix(targetMatrix);
			_euler.setFromQuaternion(this.object.quaternion);
		} else {
			_euler.setFromQuaternion(this.object.quaternion);

			_euler.y -= this.current.movementX * 0.0003 * lookSpeedX;
			_euler.x += this.current.movementY * 0.0003 * lookSpeedY;
			_euler.x = Math.max(
				Math.PI / 2 - this.maxPolarAngle,
				Math.min(Math.PI / 2 - this.minPolarAngle, _euler.x)
			);
			_euler.z = 0;
			targetQuaternion.setFromEuler(_euler);
		}

		// Rotate toward target quaternion
		const step = lockRotSpeed * timeElapsed;
		this.object.quaternion.rotateTowards(targetQuaternion, step);

		// Update stores, reset movement
		this.updateMoveStores();
		this.current.movementX = 0;
		this.current.movementY = 0;
	}

	onMouseMove = (event) => {
		if (!this.enabled) return; // If controls are disabled, don't update movement
		if ($isLocked) return; // If we're locked on a target, don't allow mouse move

		// Keep track of how far the mouse has moved
		this.current.movementX = event.movementX || 0;
		this.current.movementY = event.movementY || 0;
	};

	updateMoveStores() {
		// Calculate store values
		const percentX = -Math.max(Math.min(this.current.movementX / moveMaxX, 1), -1);
		const percentY = -Math.max(Math.min(this.current.movementY / moveMaxY, 1), -1);

		// TODO
		const yawPercent = _euler.y / (2 * Math.PI);
		const pitchPercent = _euler.x / -Math.PI;

		// Set store values
		lookMovement.set({ x: percentX, y: percentY });
		lookPosition.set({ x: yawPercent, y: pitchPercent });
	}

	onMouseDown = (event) => {
		switch (event.which) {
			case 1:
				shootBeam(event);
				break;
			case 2:
				shootMissile(event);
				this.decreaseCurrentAmmo();
				break;
			case 3:
				this.lockOn();
				break;
		}
	};

	onMouseUp = (event) => {
		switch (event.which) {
			case 1:
				break;
			case 2:
				break;
			case 3:
				this.lockOff();
				break;
		}
	};

	lockOn = () => {
		lockTargetMesh = getLockMesh();
		if (!lockTargetMesh) return;
		if ($currentVisor === VisorType.Scan) {
			isScanning.set(true);
			scanProgress.set(100);
		}
		isLocked.set(true);
		console.log('locking');
	};

	lockOff = () => {
		if (!$isLocked) return;
		isLocked.set(false);
		isScanning.set(false);
		scanProgress.set(0, { duration: 0 });
		releaseLockMesh();
		console.log('unlocking');
	};

	onKeyDown = (event) => {
		switch (event.code) {
			case 'KeyW':
			case 'ArrowUp':
				this.moveForward = true;
				break;
			case 'KeyA':
			case 'ArrowLeft':
				this.moveLeft = true;
				break;
			case 'KeyS':
			case 'ArrowDown':
				this.moveBackward = true;
				break;
			case 'KeyD':
			case 'ArrowRight':
				this.moveRight = true;
				break;
			case 'KeyQ':
				this.moveUp = true;
				break;
			case 'KeyE':
				this.moveDown = true;
				break;
			case 'Space':
				if (this.jumps > 0) this.velocity.y = this.jumpSpeed;
				this.jumps--;
				break;
			case 'ShiftLeft':
				this.moveSpeed = this.sprintSpeed;
				break;
			case 'Digit1':
				if ($unlockedBeams.includes(BeamType.Power)) {
					currentBeam.set(BeamType.Power);
				}
				break;
			case 'Digit2':
				if ($unlockedBeams.includes(BeamType.Wave)) {
					currentBeam.set(BeamType.Wave);
				}
				break;
			case 'Digit3':
				if ($unlockedBeams.includes(BeamType.Ice)) {
					currentBeam.set(BeamType.Ice);
				}
				break;
			case 'Digit4':
				if ($unlockedBeams.includes(BeamType.Plasma)) {
					currentBeam.set(BeamType.Plasma);
				}
				break;
			case 'F1':
				event.preventDefault();
				if ($unlockedVisors.includes(VisorType.Combat)) {
					currentVisor.set(VisorType.Combat);
				}
				break;
			case 'F2':
				event.preventDefault();
				if ($unlockedVisors.includes(VisorType.Scan)) {
					currentVisor.set(VisorType.Scan);
				}
				break;
			case 'F3':
				event.preventDefault();
				if ($unlockedVisors.includes(VisorType.Thermal)) {
					currentVisor.set(VisorType.Thermal);
				}
				break;
			case 'F4':
				event.preventDefault();
				if ($unlockedVisors.includes(VisorType.Xray)) {
					currentVisor.set(VisorType.Xray);
				}
				break;
			// DANGER
			case 'KeyY':
				this.increaseDanger();
				break;
			case 'KeyH':
				this.decreaseDanger();
				break;
			// AMMO
			case 'KeyU':
				this.increaseCurrentAmmo();
				break;
			case 'KeyJ':
				this.decreaseCurrentAmmo();
				break;
			case 'KeyI':
				this.increaseMaxAmmo();
				break;
			case 'KeyK':
				this.decreaseMaxAmmo();
				break;
			case 'KeyB':
				readoutShow.set(true);
				$controls.lock;
				break;
			case 'KeyN':
				readoutShow.set(false);
				$controls.unlock;
				break;
			case 'KeyP':
				const currentMode = get(isDebugMode);
				isDebugMode.set(!currentMode);
				break;
			case 'Numpad7':
				this.increaseCurrentHealth();
				break;
			case 'Numpad1':
				this.decreaseCurrentHealth();
				break;
			case 'Numpad8':
				this.increaseMaxHealth();
				break;
			case 'Numpad2':
				this.decreaseMaxHealth();
				break;
			case 'Tab':
				event.preventDefault();
				break;
		}
	};

	onKeyUp = (event) => {
		switch (event.code) {
			case 'KeyW':
			case 'ArrowUp':
				this.moveForward = false;
				break;
			case 'KeyA':
			case 'ArrowLeft':
				this.moveLeft = false;
				break;
			case 'KeyS':
			case 'ArrowDown':
				this.moveBackward = false;
				break;
			case 'KeyD':
			case 'ArrowRight':
				this.moveRight = false;
				break;
			case 'ShiftLeft':
				this.moveSpeed = this.walkSpeed;
				break;
			case 'KeyQ':
				this.moveUp = false;
				break;
			case 'KeyE':
				this.moveDown = false;
				break;
			case 'Tab':
				event.preventDefault();
				break;
		}
	};

	getObject() {
		return this.object;
	}

	increaseCurrentHealth() {
		currentHealth.update((n) => Math.min(n + randomInt(10, 35), get(maxHealth)));
	}

	decreaseCurrentHealth() {
		currentHealth.update((n) => Math.max(n - randomInt(10, 35), 0));
	}

	increaseMaxHealth() {
		maxHealth.update((n) => Math.min(n + 100, get(capHealth)));
	}

	decreaseMaxHealth() {
		maxHealth.update((n) => Math.max(n - 100, 0));
		currentHealth.update((n) => Math.min(n, get(maxHealth)));
	}

	increaseDanger() {
		currentDanger.update((n) => Math.min(n + 1, 100));
	}

	decreaseDanger() {
		currentDanger.update((n) => Math.max(n - 1, 0));
	}

	increaseCurrentAmmo() {
		currentAmmo.update((n) => Math.min(n + 1, get(maxAmmo)));
	}

	decreaseCurrentAmmo() {
		currentAmmo.update((n) => Math.max(n - 1, 0));
	}

	increaseMaxAmmo() {
		maxAmmo.update((n) => Math.min(n + 5, get(capAmmo)));
	}

	decreaseMaxAmmo() {
		maxAmmo.update((n) => {
			const shouldUpdate = n - 5 >= 0;
			if (shouldUpdate) {
				currentAmmo.update((m) => Math.min(m, n - 5));
				return n - 5;
			}
			return 0;
		});
	}
}
