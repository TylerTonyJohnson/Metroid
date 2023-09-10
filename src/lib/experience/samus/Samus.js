import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import FirstPersonControls from '../FirstPersonControls.js';
import { tweened } from 'svelte/motion';
import {
	lookMovement,
	lookDistance,
	currentHealth,
	maxHealth,
	capHealth,
	currentAmmo,
	maxAmmo,
	capAmmo,
	appState, 
	currentDanger
} from '../../stores.js';
import ArmCannon from './ArmCannon.js';
import Seeker from './Seeker.js';
import { AppState, BodyGroup } from '../../enums.js';
import { clamp, mapRange } from '../../math.js';

const dangerDistMin = 2;
const dangerDistMax = 12;

export default class Samus {
	constructor(experience) {
		// Setup
		this.experience = experience;
		this.world = this.experience.world;
		this.time = this.world.time;
		this.resources = this.world.resources;
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;
		this.debug = this.experience.debug;
		this.physicsWorld = this.experience.world.physicsWorld;
		this.listener = this.experience.listener;

		// Config

		this.setStores();
		this.setModel();
		this.setCamera();
		this.setArmCannon();
		this.setBody();
		this.setSeeker();
		this.setControls();
		this.setSounds();
		this.setHealth();
		this.spawn();
		this.takeOver();

		// Debug
		if (this.debug.isActive) {
			this.setDebug();
		}

		// Resize
		this.sizes.addEventListener('resize', () => {
			this.resizeCamera();
		});
	}

	/* 
		Setup
	*/

	setStores() {
		// Health
		currentHealth.subscribe((value) => {
			this.$currentHealth = value;
			if (this.$currentHealth < 1) {
				this.kill();
			}
		});
		maxHealth.subscribe((value) => {
			this.$maxHealth = value;
		});
		capHealth.subscribe((value) => {
			this.$capHealth = value;
		});

		// Ammo
		currentAmmo.subscribe((value) => {
			this.$currentAmmo = value;
		});
		maxAmmo.subscribe((value) => {
			this.$maxAmmo = value;
		});
		capAmmo.subscribe((value) => {
			this.$capAmmo = value;
		});

		// Looking
		lookMovement.subscribe((value) => {
			this.$lookMovement = value;
		});
	}

	setModel() {
		this.height = 2;
		this.radius = 0.5;

		this.group = new THREE.Group();
		this.group.position.set(50, 2, 0);
		this.group.rotation.y = -Math.PI / 2;
		
	}

	setMesh() {
		const sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 8);
		const cylinderGeometry = new THREE.CylinderGeometry(
			this.radius,
			this.radius,
			this.height - 2 * this.radius,
			8
		);
		const material = new THREE.MeshBasicMaterial({ wireframe: true });
		this.sphereBottom = new THREE.Mesh(sphereGeometry, material);
		this.sphereBottom.position.set(0, -(this.height - 2 * this.radius), 0);
		this.sphereTop = new THREE.Mesh(sphereGeometry, material);
		this.sphereTop.position.set(0, 0, 0);
		this.cylinder = new THREE.Mesh(cylinderGeometry, material);
		this.cylinder.position.set(0, -(this.height - 2 * this.radius) / 2, 0);
		this.group.add(this.sphereBottom, this.sphereTop, this.cylinder);
	}

	setBody() {
		const sphereShape = new CANNON.Sphere(this.radius);
		const cylinderShape = new CANNON.Cylinder(
			this.radius,
			this.radius,
			this.height - 2 * this.radius,
			8
		);
		this.body = new CANNON.Body({ mass: 10 });
		this.body.type = CANNON.Body.DYNAMIC;
		this.body.position.copy(this.group.position);
		this.body.addShape(sphereShape, new CANNON.Vec3(0, -(this.height - 2 * this.radius), 0));
		this.body.addShape(sphereShape, new CANNON.Vec3(0, 0, 0));
		this.body.addShape(cylinderShape, new CANNON.Vec3(0, -(this.height - 2 * this.radius) / 2, 0));
		this.body.linearDamping = 0.9;
		this.body.fixedRotation = true;
		this.body.collisionFilterGroup = BodyGroup.Samus;
		this.body.collisionFilterMask = BodyGroup.Pickups | BodyGroup.Walls;
		this.body.updateMassProperties();
		this.physicsWorld.addBody(this.body);
	}

	setCamera() {
		// Camera details
		this.camera = this.experience.camera.instance;
		this.group.add(this.camera);
		this.camera.name = 'Samus Cam';
		this.camera.position.set(0, 0, 0);
		this.camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

		// Audio details
		this.camera.add(this.listener);

		// Raycaster details
		this.raycaster = new THREE.Raycaster();
	}

	setArmCannon() {
		this.armCannon = new ArmCannon(this);
	}

	setControls() {
		this.controls = new FirstPersonControls(this.experience, this);
	}

	setSeeker() {
		this.seeker = new Seeker(this);
	}

	setSounds() {
		// Set references
		this.damageSounds = [
			this.resources.items.damageSound1,
			this.resources.items.damageSound2,
			this.resources.items.damageSound3,
			this.resources.items.damageSound4,
			this.resources.items.damageSound5,
			this.resources.items.damageSound6
		];

		this.deathSound = this.resources.items.deathSound;

		// Set timer
		this.soundTimer = -1;
	}

	setHealth() {
		this.isDamaging = false;
		this.damageOverTime = 0;
		this.damageToTake = 0;
	}
	/* 
		Actions
	*/

	spawn() {
		this.isAlive = true;
		this.scene.add(this.group);
	}

	takeOver() {
		this.experience.renderer.camera = this.camera;
	}

	resizeCamera() {
		this.camera.aspect = this.sizes.width / this.sizes.height;
		this.camera.updateProjectionMatrix();
	}

	// Health
	updateCurrentHealth(healthNum = 25) {
		currentHealth.update((n) => Math.min(Math.max(n + healthNum, 0), this.$maxHealth));
		if (healthNum < 0) {
			this.playDamageSound();
		}
	}

	setDamageOverTime(rate = 10) {
		if (rate > 0) {
			this.isDamaging = true;
		} else {
			this.isDamaging = false;
		}
		this.damageOverTime = rate;
	}

	updateMaxHealth(healthNum = 100) {
		maxHealth.update((n) => Math.min(Math.max(n + healthNum, 0), this.$capHealth));
		currentHealth.set(this.$maxHealth);
	}

	// Ammo
	updateCurrentAmmo(ammoNum = 5) {
		currentAmmo.update((n) => Math.min(Math.max(n + ammoNum, 0), this.$maxAmmo));
	}

	updateCurrentAmmo(ammoNum = 5) {
		currentAmmo.update((n) => Math.min(Math.max(n + ammoNum, 0), this.$maxAmmo));
	}

	updateMaxAmmo(ammoNum = 5) {
		maxAmmo.update((n) => Math.min(Math.max(n + ammoNum, 0), this.$capAmmo));
		this.updateCurrentAmmo(5);
	}

	// Life
	kill() {
		if (!this.isAlive) return;
		this.isAlive = false;

		this.controls.enabled = false;
		this.playDeathSound();
		appState.set(AppState.Dying);
		setTimeout(() => {
			window.location.reload();

		}, 2500);
	}

	playDamageSound() {
		// Check if it's been long enough since the last damage
		const timeSinceLast = (this.time.run - this.soundTimer) / 1000;
		if (timeSinceLast < 1) return;

		// Play sound
		const sound = new THREE.Audio(this.listener);
		const soundChoice = Math.floor(Math.random() * this.damageSounds.length);
		sound.buffer = this.damageSounds[soundChoice];
		sound.setVolume(0.15);
		sound.play();

		// Set timer
		this.soundTimer = this.time.run;
	}

	playDeathSound() {
		const sound = new THREE.Audio(this.listener);
		sound.buffer = this.deathSound;
		sound.setVolume(0.15);
		sound.play();
	}
	/* 
		Update
	*/

	update() {
		// Body and Mesh
		this.controls.update();
		this.group.position.copy(this.body.position);

		// Health
		this.updateDamageOverTime();

		// Update others
		this.armCannon.update();
		this.seeker.update();
		this.updateDanger();
	}

	setDebug() {
		this.debugFolder = this.debug.gui.addFolder('Samus');
		this.debugFolder.add(this, 'takeOver');
	}

	/* 
		Utilities
	*/
	updateDamageOverTime() {
		if (this.$currentHealth < 1) return;
		if (!this.isDamaging) return;
		this.damageToTake += this.damageOverTime * (this.time.delta / 1000);

		const roundedDamage = Math.floor(this.damageToTake);
		if (this.damageToTake > 1) {
			this.updateCurrentHealth(-roundedDamage);
			this.damageToTake += -roundedDamage;
		}
		// console.log(this.damageToTake);
	}

	updateDanger() {
		// Get closest danger object distance
		let closestDistance = Infinity;
		for (const dangerMesh of this.world.dangerMeshes) {
			const distance = this.group.position.distanceTo(dangerMesh.position);
			if ( distance < closestDistance) {
				closestDistance = distance;
			}
		}

		// Calculate the percent danger
		const clampedDist = clamp(closestDistance, dangerDistMin, dangerDistMax);
		const flippedDist = dangerDistMax - clampedDist;
		const scaledDist = mapRange(flippedDist, 0, 10, 0, 100);

		// Set the percent danger
		currentDanger.set(scaledDist);
	}
}
