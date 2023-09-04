import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { AppState, BeamType, VisorType } from '../enums';
import {
	appState,
	unlockedBeams,
	currentBeam,
	unlockedVisors,
	currentVisor,
	lookPosition,
	lookMovement,
	isScanning,
	scanProgress,
	isLocked,
	isScanned
} from '../stores';

const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
const rotationSpeedMax = { x: 1, y: 1 };
const lookSpeedX = 5;
const lookSpeedY = 8;
const lockRotSpeed = 5;

const targetQuaternion = new THREE.Quaternion();


export default class FirstPersonControls extends THREE.EventDispatcher {
	constructor(experience, samus) {
		super();
		this.experience = experience;
		this.canvas = this.experience.canvas;
		this.samus = samus;
		this.object = this.samus.group;
		this.camera = this.samus.camera;
		this.cannonBody = this.samus.body;
		this.time = this.experience.time;
		this.armCannon = this.samus.armCannon;
		this.seeker = this.samus.seeker;

		// Setup
		this.setStores();
		this.setPointerLock();
		this.setCannonBody();
		this.setEventListeners();
		this.setMovement();
		this.setLockOn();
	}

	/* 
		---------- SETUP ----------
	*/

	setStores() {
		appState.subscribe((value) => {
			this.$appState = value;
		});

		unlockedBeams.subscribe((value) => {
			this.$unlockedBeams = value;
		});

		currentVisor.subscribe((value) => {
			this.$currentVisor = value;
		});

		unlockedVisors.subscribe((value) => {
			this.$unlockedVisors = value;
		});

		isLocked.subscribe((value) => {
			this.$isLocked = value;
		});

		isScanned.subscribe((value) => {
			this.$isScanned = value;
			if (this.$isScanned) {
				appState.set(AppState.ScanPaused);
			} else {
				// appState.set(AppState.Running);
			}
		});
	}

	setPointerLock() {
		this.lockEvent = { type: 'lock' };
		this.unlockEvent = { type: 'unlock' };

		this.canvas.addEventListener('click', () => {
			this.lock();
		});

		this.canvas.addEventListener('pointerdown', () => {
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
		document.addEventListener('mousedown', this.onMouseDown);
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('pointerlockchange', this.onPointerlockChange);
		document.addEventListener('pointerlockerror', this.onPointerlockError);
		document.addEventListener('keydown', this.onKeyDown);
		document.addEventListener('keyup', this.onKeyUp);
	}

	setMovement() {
		this.minPolarAngle = 0;
		this.maxPolarAngle = Math.PI;
		this.enabled = false; // Set this control as disabled until it's ready

		this.strafeSpeed = 10; // Unused right now
		this.jumpSpeed = 20;
		this.maxJumps = 2;
		this.jumps = this.maxJumps;
		// Runtime
		this.moveForward = false; // Set movement booleans
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.moveDown = false;
		this.rotateLeft = false;
		this.rotateRight = false;
		this.rotationSpeed = { x: 0, y: 0 };

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

	setLockOn() {
		this.targetMatrix = new THREE.Matrix4();
		this.lockOnMesh = null;
	}

	dispose() {
		this.removeEventListeners();
	}

	removeEventListeners() {
		document.removeEventListener('mousedown', this.onMouseDown);
		document.removeEventListener('mouseup', this.onMouseUp);
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

	onMouseDown = (event) => {
		if (!this.enabled) return;
		if (this.$appState !== AppState.Running) return;
		switch (event.which) {
			case 1:
				this.armCannon.shootBeam();
				break;
			case 2:
				break;
			case 3:
				this.lockOn();
				break;
		}
	};

	onMouseUp = (event) => {
		if (!this.enabled) return;
		if (this.$appState !== AppState.Running) return;
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

	onKeyDown = (event) => {
		switch (event.code) {
			/* 
				Movement
			*/
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
			/* 
				Beams
			*/
			case 'Digit1':
				this.changeBeam(BeamType.Power);
				break;
			case 'Digit2':
				this.changeBeam(BeamType.Wave);
				break;
			case 'Digit3':
				this.changeBeam(BeamType.Ice);
				break;
			case 'Digit4':
				this.changeBeam(BeamType.Plasma);
				break;
			/* 
				Visors	
			*/
			case 'F1':
				event.preventDefault();
				this.changeVisor(VisorType.Combat);
				break;
			case 'F2':
				event.preventDefault();
				this.changeVisor(VisorType.Scan);
				break;
			case 'F3':
				event.preventDefault();
				this.changeVisor(VisorType.Thermal);
				break;
			case 'F4':
				event.preventDefault();
				this.changeVisor(VisorType.Xray);
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
		}
		this.jumps--;
	}

	lockOn() {
		// Check if there's anything to lock onto
		this.lockOnMesh = this.seeker.closestMesh;
		if (!this.lockOnMesh) return;

		// Check if we're scanning
		if (this.$currentVisor === VisorType.Scan) {
			isScanning.set(true);
			scanProgress.set(100);
		}
		isLocked.set(true);
		console.log('locking');
	}

	lockOff() {
		if (!this.$isLocked) return;
		isLocked.set(false);
		isScanning.set(false);
		// isScanned.set(false);
		scanProgress.set(0, { duration: 0 });
		this.lockOnMesh = null;
		console.log('locking off');
	}

	changeBeam(beamType) {
		if (this.$unlockedBeams.includes(beamType)) currentBeam.set(beamType);
	}

	changeVisor(visorType) {
		if (this.$unlockedVisors.includes(visorType)) currentVisor.set(visorType);
	}

	// shootBeam() {
	// 	console.log('shooting');
	// }

	/* 
		---------- RUNTIME ----------
	*/

	update() {
		if (this.enabled === false) {
			return;
		}

		this.updatePosition();
		this.updateRotation();
	}

	updatePosition() {
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
		this.inputForce.multiplyScalar(this.moveSpeed * this.time.delta);
		this.inputForce.applyQuaternion(this.cannonBody.quaternion);

		const cannonForce = new CANNON.Vec3(
			this.inputForce.x,
			this.inputForce.y,
			this.inputForce.z
		).scale(800);

		// Apply force
		this.cannonBody.applyForce(cannonForce);
		this.object.position.copy(this.cannonBody.position);
	}

	updateRotation() {
		/* 
			Calculate rotation and speed
		*/
		// Get current rotation
		_euler.setFromQuaternion(this.object.quaternion);

		const rotationStart = {
			x: _euler.x,
			y: _euler.y
		};

		if (this.$isLocked && this.lockOnMesh.isAlive) {
			console.log(this.lockOnMesh.isObject3D)
			this.targetMatrix.lookAt(this.lockOnMesh.position, this.object.position, this.object.up);
			targetQuaternion.setFromRotationMatrix(this.targetMatrix);
			_euler.setFromQuaternion(this.object.quaternion);

			// console.log(this.camera);
		} else {
			this.lockOff();
			// Make changes to target rotation
			_euler.y -= this.currentInput.movementX * 0.0003 * lookSpeedX;
			_euler.x += this.currentInput.movementY * 0.0003 * lookSpeedY;
			_euler.x = Math.max(
				Math.PI / 2 - this.maxPolarAngle,
				Math.min(Math.PI / 2 - this.minPolarAngle, _euler.x)
			);
			_euler.z = 0;

			targetQuaternion.setFromEuler(_euler);
		}

		// Rotate toward target quaternion
		const step = lockRotSpeed * this.time.delta /1000;
		this.object.quaternion.rotateTowards(targetQuaternion, step);
		this.cannonBody.quaternion.setFromEuler(0, _euler.y, 0);

		// Calculate rotation speed
		this.rotationSpeed = {
			x: (_euler.x - rotationStart.x) / (this.time.delta / 1000),
			y: (_euler.y - rotationStart.y) / (this.time.delta / 1000)
		};

		/* 
			Normalize rotation and speed 
		*/

		// Rotation
		this.rotationPercent = {
			x: (_euler.x / -Math.PI) * 2,
			y: _euler.y / Math.PI
		};

		// Rotation speed
		this.rotationSpeedPercent = {
			x: -Math.max(Math.min(this.rotationSpeed.x / rotationSpeedMax.x, 1), -1),
			y: -Math.max(Math.min(this.rotationSpeed.y / rotationSpeedMax.y, 1), -1)
		};

		/* 
			STORES
		*/

		// // Set store values
		lookPosition.set(this.rotationPercent);
		lookMovement.set(this.rotationSpeedPercent);

		// Update stores, reset movement
		this.currentInput.movementX = 0;
		this.currentInput.movementY = 0;
	}
}
