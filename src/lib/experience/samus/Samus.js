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
	capAmmo
} from '../../stores.js';
import ArmCannon from './ArmCannon.js';
import Seeker from './Seeker.js';
import { BodyGroup } from '../../enums.js';

export default class Samus {
	constructor(experience) {
		// Setup
		this.experience = experience;
		this.world = this.experience.world;
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;
		this.debug = this.experience.debug;
		this.physicsWorld = this.experience.world.physicsWorld;
		this.listener = this.experience.listener;

		// Config
		this.height = 2;
		this.radius = 0.5;
		this.setStores();
		this.setGroup();
		this.setCamera();
		this.setArmCannon();
		this.setBody();
		this.setSeeker();
		this.setControls();
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
			if (this.$currentHealth === 0) {
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

	setGroup() {
		this.group = new THREE.Group();
		this.group.position.set(50, 2, 0);
		this.group.rotation.y = -Math.PI / 2;
		this.scene.add(this.group);
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
	/* 
		Actions
	*/

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
		this.controls.enabled = false;
		window.location.reload();
	}

	/* 
		Update
	*/

	update() {
		// Body and Mesh
		this.controls.update();
		this.group.position.copy(this.body.position);

		// Update others
		this.armCannon.update();
		this.updateSeeker();
		// this.updateRayCaster();
	}

	updateSeeker() {
		this.seeker.update();
	}

	// updateRayCaster() {
	// 	// Ray caster
	// 	this.raycaster.setFromCamera(new THREE.Vector2(), this.camera);
	//     const intersects = this.raycaster.intersectObjects(this.world.lookableMeshes, false);

	//     if (intersects.length > 0) {
	//         lookDistance.set(intersects[0].distance);
	//     } else {
	//         lookDistance.set(Infinity);
	//     }
	// }

	setDebug() {
		this.debugFolder = this.debug.gui.addFolder('Samus');
		this.debugFolder.add(this, 'takeOver');
	}
}
