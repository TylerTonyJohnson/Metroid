import * as THREE from 'three';
import * as CANNON from 'cannon';
import { VisorType, BeamType } from './enums';
import { get } from 'svelte/store';
import {
	currentVisor,
	unlockedVisors,
	currentBeam,
	unlockedBeams,
	lookMovement,
	lookPosition,
	isLockable,
	isLocked,
	currentDanger,
	currentAmmo,
	maxAmmo,
	capAmmo,
	readoutShow,
	controls as $controls,
	isDebugMode,
	currentHealth,
	maxHealth,
	capHealth
} from './stores';
import { clamp, randomInt } from './math';
import { shoot, getLockMesh as getLockMesh, releaseLockMesh } from './scene';

let $unlockedVisors;
let $unlockedBeams;
let $lookMovement;
let $isLocked;
let mouseTimer;

const moveMaxX = 5;
const moveMaxY = 5;
const lockRotSpeed = 5;

const targetMatrix = new THREE.Matrix4();
const targetQuaternion = new THREE.Quaternion();
let lockTargetMesh = new THREE.Vector3(0, 0, 0);

export class PlayerController extends THREE.EventDispatcher {
	constructor(camera, cannonBody) {
		super();
		this.object = new THREE.Group();
		this.enabled = false; // Set this control as disabled until it's ready

		this.camera = camera;
		camera.rotation.y = Math.PI;
		this.object.add(this.camera);
		this.cannonBody = cannonBody; // Link the physics body to the controller

		// this.rotation = new THREE.Quaternion();
		// this.position = new THREE.Vector3();

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
		this.phi = 0; // X-rotation
		this.phiSpeed = 8; // Units?
		this.theta = 0;
		this.thetaSpeed = 5; // Units?

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
		} else {
			this.dispatchEvent(this.unlockEvent);

			this.isLocked = false;
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
		if ($isLocked) {
			this.updateLockedRotation(timeElapsed);
		} else {
			this.updateFreeRotation(timeElapsed);
		}
	}

	updateLockedRotation(timeElapsed) {
		console.log('updating rotation');

		// Create target quaternion
		targetMatrix.lookAt(lockTargetMesh, this.object.position, this.object.up);
		targetQuaternion.setFromRotationMatrix(targetMatrix);

		// Lerp toward target quaternion
		const step = lockRotSpeed * timeElapsed;
		this.object.quaternion.rotateTowards(targetQuaternion, step);

		this.theta = this.object.rotation.x;
		this.phi = this.object.rotation.y;
	}

	updateFreeRotation(timeElapsed) {
		// Calculate angle change since last frame
		this.phi += -(this.current.movementX / window.innerWidth) * this.phiSpeed;
		this.theta = clamp(
			this.theta + (this.current.movementY / window.innerHeight) * this.thetaSpeed,
			-Math.PI / 2,
			Math.PI / 2
		);

		// Calculate new target quaternion
		const qx = new THREE.Quaternion();
		qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);
		const qz = new THREE.Quaternion();
		qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta);
		const q = new THREE.Quaternion();
		q.multiply(qx);
		q.multiply(qz);

		// Interpolate to target quaternion
		const t = 1.0 - Math.pow(0.01, 5 * timeElapsed);
		this.object.quaternion.slerp(q, t);

		// Reset movement to zero for next loop
		this.updateMoveStores();
		this.current.movementX = 0;
		this.current.movementY = 0;
	}

	onMouseMove = (event) => {
		if (!this.enabled) return;
		if ($isLocked) return; // If we're locked on a target, don't allow mouse move

		this.current.movementX = event.movementX;
		this.current.movementY = event.movementY;

		// Update Store Values
		this.updateMoveStores();
	};

	updateMoveStores() {
		// Calculate store values
		const percentX = -Math.max(Math.min(this.current.movementX / moveMaxX, 1), -1);
		const percentY = -Math.max(Math.min(this.current.movementY / moveMaxY, 1), -1);

		// TODO
		const yawPercent = this.phi / (2 * Math.PI);
		const pitchPercent = this.theta / Math.PI;

		// Set store values
		lookMovement.set({ x: percentX, y: percentY });
		lookPosition.set({ x: yawPercent, y: pitchPercent });
		// vertLook.set(pitchPercent);
		// horzLook.set(yawPercent);
	}

	// onMouseStop = () => {
	// 	this.current.movementX = 0;
	// 	this.current.movementY = 0;

	// 	lookMovement.update((value) => {
	// 		value.x = 0;
	// 		return value;
	// 	});

	// 	lookMovement.update((value) => {
	// 		value.y = 0;
	// 		return value;
	// 	});
	// };

	onMouseDown = (event) => {
		switch (event.which) {
			case 1:
				shoot(event);
				break;
			case 2:
				break;
			case 3:
				// zoom(2);
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
				// zoom(1);
				break;
		}
	};

	lockOn = () => {
		lockTargetMesh = getLockMesh();
		if (!lockTargetMesh) return;
		isLocked.set(true);
		console.log('locking');
	};

	lockOff = () => {
		if (!$isLocked) return;
		isLocked.set(false);
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
			// case 'Comma':
			// 	isLocked.set(true);
			// 	break;
			// case 'Period':
			// 	isLocked.set(false);
			// 	break;
			// case 'Semicolon':
			// 	isLockable.set(true);
			// 	break;
			// case 'Quote':
			// 	isLockable.set(false);
			// 	break;
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

	// getDirection() {
	// 	const vector = new CANNON.Vec3(0, 0, -1);
	// 	vector.applyQuaternion(this.quaternion);
	// 	return vector;
	// }

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
