import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import FirstPersonControls from '../FirstPersonControls.js';
import { tweened } from 'svelte/motion';
import { lookMovement, lookDistance } from '../../stores.js';
import ArmCannon from './ArmCannon.js';
import Seeker from './Seeker.js';

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

		// Config
		this.height = 2;
		this.radius = 0.5;
		this.setGroup();
		this.setCamera();
		this.setArmCannon();
		this.setBody();
		this.setControls();
		this.setSeeker();
		this.takeOver();

		// Stores
		lookMovement.subscribe((value) => {
			this.$lookMovement = value;
		});

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
		this.listener = this.experience.listener;
		this.camera.add(this.listener);

		// Raycaster details
		this.raycaster = new THREE.Raycaster();
	}

	/* 
		Actions
	*/

	takeOver() {
		this.experience.renderer.camera = this.camera;
	}

	setControls() {
		this.controls = new FirstPersonControls(this.experience, this);
	}

	setSeeker() {
		this.seeker = new Seeker(this);
	}

	resizeCamera() {
		this.camera.aspect = this.sizes.width / this.sizes.height;
		this.camera.updateProjectionMatrix();
	}

	setArmCannon() {
		this.armCannon = new ArmCannon(this);
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
