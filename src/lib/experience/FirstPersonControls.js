import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { appState } from '../stores';
import { AppState } from '../enums';

const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
const moveMaxX = 5;
const moveMaxY = 5;
const lookSpeedX = 5;
const lookSpeedY = 8;
const lockRotSpeed = 10;

const targetQuaternion = new THREE.Quaternion();

export default class FirstPersonControls extends THREE.EventDispatcher {
	constructor(experience, target) {
		super();
		this.experience = experience;
		this.canvas = this.experience.canvas;
		this.target = target;
		this.object = this.target.group;
		this.camera = this.target.camera;
		this.cannonBody = this.target.body;
		this.time = this.experience.time;

		// Setup
		this.minPolarAngle = 0;
		this.maxPolarAngle = Math.PI;
		this.enabled = false; // Set this control as disabled until it's ready

		// camera.rotation.y = Math.PI;

		this.strafeSpeed = 10; // Unused right now
		this.jumpSpeed = 20;
		this.maxJumps = 2;
		this.jumps = this.maxJumps;

		this.lockEvent = { type: 'lock' };
		this.unlockEvent = { type: 'unlock' };

		this.setPointerLock();
		this.setCannonBody();
		this.setEventListeners();

		// Runtime
		this.moveForward = false; // Set movement booleans
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.moveDown = false;
		this.rotateLeft = false;
		this.rotateRight = false;

		this.inputForce = new THREE.Vector3();

		this.walkSpeed = 0.025;
		this.sprintSpeed = this.walkSpeed * 2;
		this.moveSpeed = this.walkSpeed;

		this.currentInput = {
			isLeftMouse: false,
			isRightMouse: false,
			isMiddleMouse: false,
			movementX: 0,
			movementY: 0
		};
	}

	/* 
		---------- SETUP ----------
	*/

	setPointerLock() {
		this.canvas.addEventListener('click', () => {
			this.lock();
		});

		this.addEventListener('lock', () => {
			this.enabled = true;
		});

		this.addEventListener('unlock', () => {
			this.enabled = false;
		});
	}

	setCannonBody() {
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

	setEventListeners() {
		document.addEventListener('mousemove', this.onMouseMove);
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
			appState.set(AppState.Running);
		} else {
			this.dispatchEvent(this.unlockEvent);
			this.isLocked = false;
			appState.set(AppState.Paused);
		}
	};

	onPointerlockError = () => {
		console.error('PointerLockControlsCannon: Unable to use Pointer Lock API');
	};

	/* 
		---------- CONTROLS INPUT ----------
	*/

	onMouseMove = (event) => {
		if (!this.enabled) return; // If controls are disabled, don't update movement
		// Keep track of how far the mouse has moved
		this.currentInput.movementX = event.movementX || 0;
		this.currentInput.movementY = event.movementY || 0;
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
			case 'Space':
				this.jump();
				break;
			case 'ShiftLeft':
				this.moveSpeed = this.sprintSpeed;
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
		}
	};

	/* 
		---------- ACTIONS ----------
	*/

	jump() {
		if (this.jumps > 0) {
			this.cannonBody.applyImpulse(new CANNON.Vec3(0, 200, 0));
			// this.velocity.y = this.jumpSpeed;
		}
		this.jumps--;
	}

	/* 
		---------- RUNTIME ----------
	*/

	update() {
		if (this.enabled === false) {
			return;
		}

		this.updatePosition(this.time.delta);
		this.updateRotation(this.time.delta);
	}

	updatePosition(timeElapsed) {
		// Calculate total direction of new velocity relative to player
		this.inputForce.set(0, 0, 0);
		if (this.moveForward) {
			this.inputForce.add(new THREE.Vector3(0, 0, 1));
		}
		if (this.moveBackward) {
			this.inputForce.add(new THREE.Vector3(0, 0, -1));
		}
		if (this.moveLeft) {
			this.inputForce.add(new THREE.Vector3(1, 0, 0));
		}
		if (this.moveRight) {
			this.inputForce.add(new THREE.Vector3(-1, 0, 0));
		}
		if (this.moveUp) {
			this.inputForce.add(new THREE.Vector3(0, -1, 0));
		}
		if (this.moveDown) {
			this.inputForce.add(new THREE.Vector3(0, 1, 0));
		}

		// Scale and rotate velocity to world coordinates
		this.inputForce.normalize();
		this.inputForce.multiplyScalar(this.moveSpeed * timeElapsed);
		this.inputForce.applyQuaternion(this.cannonBody.quaternion);

		const cannonForce = new CANNON.Vec3(this.inputForce.x, this.inputForce.y, this.inputForce.z).scale(800);

		// Add total new velocity to the physics body
		// this.cannonBody.velocity.x += this.inputForce.x;
		// this.cannonBody.velocity.z += this.inputForce.z;
		this.cannonBody.applyForce(cannonForce);
		this.object.position.copy(this.cannonBody.position);
	}

	updateRotation(timeElapsed) {
		// Calculate target quaternion
		_euler.setFromQuaternion(this.object.quaternion);

		_euler.y -= this.currentInput.movementX * 0.0003 * lookSpeedX;
		_euler.x += this.currentInput.movementY * 0.0003 * lookSpeedY;
		_euler.x = Math.max(
			Math.PI / 2 - this.maxPolarAngle,
			Math.min(Math.PI / 2 - this.minPolarAngle, _euler.x)
		);
		_euler.z = 0;
		targetQuaternion.setFromEuler(_euler);

		// Rotate toward target quaternion
		const step = lockRotSpeed * timeElapsed;
		this.object.quaternion.rotateTowards(targetQuaternion, step);
		this.cannonBody.quaternion.setFromEuler(0, _euler.y, 0);

		// Update stores, reset movement
		this.currentInput.movementX = 0;
		this.currentInput.movementY = 0;
	}
}
