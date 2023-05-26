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
	isLockable,
	isLocked,
	vertLook,
	horzLook,
	currentDanger,
	currentAmmo,
	maxAmmo,
	readoutShow,
	controls as $controls,
	isDebugMode
} from './stores';
import { clamp } from './math';
import { shoot, lockOn, lockOff } from './scene';

let $unlockedVisors;
let $unlockedBeams;
let $lookMovement;
let $isLocked;
let mouseTimer;

const moveMaxX = 5;
const moveMaxY = 5;

export class PlayerController extends THREE.EventDispatcher {
	constructor(camera, cannonBody) {
		super();

		this.enabled = false; // Set this control as disabled until it's ready

		this.camera = camera;
		this.cannonBody = cannonBody; // Link the physics body to the controller

		this.rotation = new THREE.Quaternion();
		this.position = new THREE.Vector3();

		this.walkSpeed = 10;
		this.strafeSpeed = 10;
		this.jumpSpeed = 20;
		this.maxJumps = 2;
		this.jumps = this.maxJumps;

		this.lockEvent = { type: 'lock' };
		this.unlockEvent = { type: 'unlock' };

		this.setupCannonBody();
		this.subscribeToStores();
		this.setupEventListeners();

		// Runtime
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

		// GET RID OF
		this.velocityFactor = 20;
		this.quaternion = new THREE.Quaternion();

		this.moveForward = false; // Set movement booleans
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.rotateLeft = false;
		this.rotateRight = false;

		this.pitchObject = new THREE.Object3D();
		this.pitchObject.add(camera);

		this.yawObject = new THREE.Object3D();
		this.yawObject.position.y = 2;
		this.yawObject.add(this.pitchObject);

		this.inputVelocity = new THREE.Vector3();
		this.euler = new THREE.Euler();
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

		this.inputVelocity.set(0, 0, 0);

		if (this.moveForward) {
			this.inputVelocity.z = -this.velocityFactor * timeElapsed;
		}
		if (this.moveBackward) {
			this.inputVelocity.z = this.velocityFactor * timeElapsed;
		}

		if (this.moveLeft) {
			this.inputVelocity.x = -this.velocityFactor * timeElapsed;
		}
		if (this.moveRight) {
			this.inputVelocity.x = this.velocityFactor * timeElapsed;
		}
		if (this.rotateLeft) {
		}
		if (this.rotateRight) {
		}

		// Convert velocity to world coordinates
		// this.euler.x = this.pitchObject.rotation.x;
		// this.euler.y = this.yawObject.rotation.y;
		// this.euler.order = 'XYZ';
		// this.quaternion.setFromEuler(this.euler);
		this.inputVelocity.applyQuaternion(this.quaternion);

		// Add to the object
		this.velocity.x += this.inputVelocity.x;
		this.velocity.z += this.inputVelocity.z;

		this.yawObject.position.copy(this.cannonBody.position);
		// this.position.copy(this.cannonBody.position);

		this.updateRotation(timeElapsed);
		this.updateCamera(timeElapsed);


	}

	updateRotation(timeElapsed) {
		// Update rotation values
		this.phi += -(this.current.movementX / window.innerWidth) * this.phiSpeed;
		this.theta = clamp(
			this.theta + -(this.current.movementY / window.innerHeight) * this.thetaSpeed,
			-Math.PI / 2,
			Math.PI / 2
		);
		// console.log(this.phi, this.theta);
		const qx = new THREE.Quaternion();
		qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);
		const qz = new THREE.Quaternion();
		qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta);

		const q = new THREE.Quaternion();
		q.multiply(qx);
		q.multiply(qz);

		// this.quaternion = q;

		const t = 1.0 - Math.pow(0.01, 5 * timeElapsed);
		this.rotation.slerp(q, t);
		// console.log(this.phi, this.theta);
		// console.log(this.rotation);
	}

	updateCamera(timeElapsed) {
		this.camera.quaternion.copy(this.rotation);
	}

	onMouseMove = (event) => {
		if (!this.enabled) return;
		if ($isLocked) return; // If we're locked on a target, don't allow mouse move

		// Set up for mouse stopping
		clearTimeout(mouseTimer);
		mouseTimer = setTimeout(this.onMouseStop, 1);

		this.current.movementX = event.movementX;
		this.current.movementY = event.movementY;

		// Update Store Values
		this.updateMoveStores();

		// OLD CODE
		// const { movementX, movementY } = event;
		// this.yawObject.rotation.y -= movementX * 0.002;
		// this.pitchObject.rotation.x -= movementY * 0.002;

		// this.pitchObject.rotation.x = Math.max(
		// 	-Math.PI / 2,
		// 	Math.min(Math.PI / 2, this.pitchObject.rotation.x)
		// );	// Limit pitch movement
	};

	updateMoveStores() {
		// Calculate store values
		const percentX = -Math.max(Math.min(this.current.movementX / moveMaxX, 1), -1);
		const percentY = -Math.max(Math.min(this.current.movementY / moveMaxY, 1), -1);

		// TODO
		const pitchPercent = (this.pitchObject.rotation.x % (2 * Math.PI)) / Math.PI;
		const yawPercent = (this.yawObject.rotation.y % (2 * Math.PI)) / (2 * Math.PI);

		// Set store values
		lookMovement.set({ x: percentX, y: percentY });
		vertLook.set(pitchPercent);
		horzLook.set(yawPercent);
	}

	onMouseStop = () => {
		this.current.movementX = 0;
		this.current.movementY = 0;

		lookMovement.update((value) => {
			value.x = 0;
			return value;
		});

		lookMovement.update((value) => {
			value.y = 0;
			return value;
		});
	};

	onMouseDown = (event) => {
		switch (event.which) {
			case 1:
				shoot(event);
				break;
			case 2:
				break;
			case 3:
				// zoom(2);
				lockOn();
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
				lockOff();
				// zoom(1);
				break;
		}
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
				this.rotateLeft = true;
				break;
			case 'KeyE':
				this.rotateRight = true;
				break;
			case 'Space':
				if (this.jumps > 0) {
					this.velocity.y = this.jumpSpeed;
				}
				this.jumps--;
				break;
			case 'ShiftLeft':
				this.velocityFactor = 0.4;
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
				currentDanger.update((value) => {
					value++;
					return value;
				});
				break;
			case 'KeyH':
				currentDanger.update((value) => {
					value--;
					return value;
				});
				break;
			// AMMO
			case 'KeyU':
				currentAmmo.update((value) => {
					value++;
					return value;
				});
				break;
			case 'KeyJ':
				currentAmmo.update((value) => {
					value--;
					return value;
				});
				break;
			case 'KeyI':
				maxAmmo.update((value) => {
					value++;
					return value;
				});
				break;
			case 'KeyK':
				maxAmmo.update((value) => {
					value--;
					return value;
				});
				break;
			case 'KeyB':
				readoutShow.set(true);
				$controls.lock;
				break;
			case 'KeyN':
				readoutShow.set(false);
				$controls.unlock;
				break;
			case 'Comma':
				isLocked.set(true);
				break;
			case 'Period':
				isLocked.set(false);
				break;
			case 'Semicolon':
				isLockable.set(true);
				break;
			case 'Quote':
				isLockable.set(false);
				break;
			case 'KeyP':
				const currentMode = get(isDebugMode);
				isDebugMode.set(!currentMode);
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
				this.velocityFactor = 0.2;
				break;
			case 'KeyQ':
				this.rotateLeft = false;
				break;
			case 'KeyE':
				this.rotateRight = false;
				break;
		}
	};

	getObject() {
		return this.yawObject;
	}

	getDirection() {
		const vector = new CANNON.Vec3(0, 0, -1);
		vector.applyQuaternion(this.quaternion);
		return vector;
	}
}

// export { PointerLockControlsCannon };
