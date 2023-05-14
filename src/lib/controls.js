import * as THREE from 'three';
import * as CANNON from 'cannon';
import { VisorType, BeamType } from './enums';
import {
	currentVisor,
	unlockedVisors as visors,
	currentBeam,
	unlockedBeams as beams,
	lookMovement as _lookMovement,
	vertLook,
	horzLook,
	currentDanger,
	currentAmmo,
	maxAmmo,
	readoutShow,
	controls as $controls
} from './stores';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
let unlockedVisors;
let unlockedBeams;
let lookMovement;
let mouseTimer;

const moveMaxX = 5;
const moveMaxY = 5;

class PointerLockControlsCannon extends THREE.EventDispatcher {
	constructor(camera, cannonBody) {
		visors.subscribe((value) => {
			unlockedVisors = value;
		});

		beams.subscribe((value) => {
			unlockedBeams = value;
		});

		_lookMovement.subscribe((value) => {
			lookMovement = value;
		});

		super();

		this.enabled = false;

		this.cannonBody = cannonBody;

		// var eyeYPos = 2 // eyes are 2 meters above the ground
		this.velocityFactor = 0.2;
		this.jumpVelocity = 20;

		this.pitchObject = new THREE.Object3D();
		this.pitchObject.add(camera);

		this.yawObject = new THREE.Object3D();
		this.yawObject.position.y = 2;
		this.yawObject.add(this.pitchObject);

		this.quaternion = new THREE.Quaternion();

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.rotateLeft = false;
		this.rotateRight = false;

		this.maxJumps = 2;
		this.jumps = this.maxJumps;

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

		// Moves the camera to the cannon.js object position and adds velocity to the object if the run key is down
		this.inputVelocity = new THREE.Vector3();
		this.euler = new THREE.Euler();

		this.lockEvent = { type: 'lock' };
		this.unlockEvent = { type: 'unlock' };

		this.connect();
	}

	connect() {
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('pointerlockchange', this.onPointerlockChange);
		document.addEventListener('pointerlockerror', this.onPointerlockError);
		document.addEventListener('keydown', this.onKeyDown);
		document.addEventListener('keyup', this.onKeyUp);
	}

	disconnect() {
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('pointerlockchange', this.onPointerlockChange);
		document.removeEventListener('pointerlockerror', this.onPointerlockError);
		document.removeEventListener('keydown', this.onKeyDown);
		document.removeEventListener('keyup', this.onKeyUp);
	}

	dispose() {
		this.disconnect();
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

	onMouseMove = (event) => {
		if (!this.enabled) {
			return;
		}

		clearTimeout(mouseTimer);
		mouseTimer = setTimeout(this.onMouseStop, 20);

		const { movementX, movementY } = event;
		const percentX = -Math.max(Math.min(movementX / moveMaxX, 1), -1);
		const percentY = -Math.max(Math.min(movementY / moveMaxY, 1), -1);

		_lookMovement.set({ x: percentX, y: percentY });

		this.yawObject.rotation.y -= movementX * 0.002;
		this.pitchObject.rotation.x -= movementY * 0.002;

		// this.yawObject.rotation.y = this.yawObject.y % (2 * Math.PI);

		this.pitchObject.rotation.x = Math.max(
			-Math.PI / 2,
			Math.min(Math.PI / 2, this.pitchObject.rotation.x)
		);

		const pitchPercent = (this.pitchObject.rotation.x % (2 * Math.PI)) / Math.PI;
		const yawPercent = (this.yawObject.rotation.y % (2 * Math.PI)) / (2 * Math.PI);

		vertLook.set(pitchPercent);
		horzLook.set(yawPercent);
	};

	onMouseStop = () => {
		_lookMovement.update((value) => {
			value.x = 0;
			return value;
		});

		_lookMovement.update((value) => {
			value.y = 0;
			return value;
		});
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
					this.velocity.y = this.jumpVelocity;
				}
				this.jumps--;
				break;
			case 'ShiftLeft':
				this.velocityFactor = 0.4;
				break;
			case 'Digit1':
				if (unlockedBeams.includes(BeamType.Power)) {
					currentBeam.set(BeamType.Power);
				}
				break;
			case 'Digit2':
				if (unlockedBeams.includes(BeamType.Wave)) {
					currentBeam.set(BeamType.Wave);
				}
				break;
			case 'Digit3':
				if (unlockedBeams.includes(BeamType.Ice)) {
					currentBeam.set(BeamType.Ice);
				}
				break;
			case 'Digit4':
				if (unlockedBeams.includes(BeamType.Plasma)) {
					currentBeam.set(BeamType.Plasma);
				}
				break;
			case 'F1':
				event.preventDefault();
				if (unlockedVisors.includes(VisorType.Combat)) {
					currentVisor.set(VisorType.Combat);
				}
				break;
			case 'F2':
				event.preventDefault();
				if (unlockedVisors.includes(VisorType.Scan)) {
					currentVisor.set(VisorType.Scan);
				}
				break;
			case 'F3':
				event.preventDefault();
				if (unlockedVisors.includes(VisorType.Thermal)) {
					currentVisor.set(VisorType.Thermal);
				}
				break;
			case 'F4':
				event.preventDefault();
				if (unlockedVisors.includes(VisorType.Xray)) {
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

	update(delta) {
		if (this.enabled === false) {
			return;
		}

		delta *= 1000;
		delta *= 0.1;

		this.inputVelocity.set(0, 0, 0);

		if (this.moveForward) {
			this.inputVelocity.z = -this.velocityFactor * delta;
		}
		if (this.moveBackward) {
			this.inputVelocity.z = this.velocityFactor * delta;
		}

		if (this.moveLeft) {
			this.inputVelocity.x = -this.velocityFactor * delta;
		}
		if (this.moveRight) {
			this.inputVelocity.x = this.velocityFactor * delta;
		}
		if (this.rotateLeft) {
		}
		if (this.rotateRight) {
		}

		// Convert velocity to world coordinates
		this.euler.x = this.pitchObject.rotation.x;
		this.euler.y = this.yawObject.rotation.y;
		this.euler.order = 'XYZ';
		this.quaternion.setFromEuler(this.euler);
		this.inputVelocity.applyQuaternion(this.quaternion);

		// Add to the object
		this.velocity.x += this.inputVelocity.x;
		this.velocity.z += this.inputVelocity.z;

		this.yawObject.position.copy(this.cannonBody.position);
	}
}

export { PointerLockControlsCannon };
