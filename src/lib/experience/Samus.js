import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export default class Samus {
	constructor(experience) {
		// Setup
		this.experience = experience;
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;
        this.debug = this.experience.debug
        this.world = this.experience.world;

        // Config
        this.height = 2;
        this.radius = 0.5;
        this.setGroup();
		this.setCamera();
        this.setArmCannon();
        this.setControls();
        this.setBody();

        // Debug
        if (this.debug.isActive) {
            this.setDebug();
        }

        this.sizes.addEventListener('resize', () => {
            this.resizeCamera();
        })

	}

    setGroup() {
        this.group = new THREE.Group();
        this.group.position.set(0, 2, 10);
        const sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 8);
        const cylinderGeometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height - 2 * this.radius, 8);
        const material = new THREE.MeshBasicMaterial({ wireframe: true });
        this.sphereBottom = new THREE.Mesh(sphereGeometry, material);
        this.sphereBottom.position.set(0, this.radius, 0);
        this.sphereTop = new THREE.Mesh(sphereGeometry, material);
        this.sphereTop.position.set(0, this.height - this.radius, 0);
        this.cylinder = new THREE.Mesh(cylinderGeometry, material);
        this.cylinder.position.set(0, this.height / 2, 0);
        this.group.add(this.sphereBottom, this.sphereTop, this.cylinder);
        this.scene.add(this.group);
    }

    setBody() {
        const sphereShape = new CANNON.Sphere(this.radius);
        const cylinderShape = new CANNON.Cylinder(this.radius, this.radius, this.height - 2 * this.radius, 8)
        this.body = new CANNON.Body({ mass: 100 });
        this.body.position.copy(this.group.position);
        this.body.addShape(sphereShape, new CANNON.Vec3(0, this.radius, 0));
        this.body.addShape(sphereShape, new CANNON.Vec3(0, this.height - this.radius, 0));
        this.body.addShape(cylinderShape, new CANNON.Vec3(0, this.height / 2, 0));
        this.body.linearDamping = 0.9;
        this.body.fixedRotation = true;
        this.body.updateMassProperties();
        this.world.physicsWorld.addBody(this.body);
    }

	setCamera() {
		this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 300);
        this.camera.name = 'Samus Cam'
        this.camera.position.set(0, this.height - this.radius, 0);
        this.group.add(this.camera);
	}

    takeOver() {
        this.experience.renderer.camera = this.camera;
    }

    setControls() {
        
    }

    resizeCamera() {
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }

    setArmCannon() {
        
        this.resources = this.experience.resources;
        this.armCannonResource = this.resources.items.armCannonGLB;
        this.armCannon = this.armCannonResource.scene;

		this.armCannon.scale.set(.5, .5, .5);
		this.armCannon.position.set(this.radius, this.height / 2, 0);
        this.armCannon.rotation.y = Math.PI;

		this.group.add(this.armCannon);

		this.armCannon.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
                child.receiveShadow = true;
			}
		});
    }

    update() {
        // this.controls.update();
        this.group.position.copy(this.body.position);
    }

    setDebug() {
        this.debugFolder = this.debug.gui.addFolder('Samus')
        this.debugFolder.add(this, 'takeOver');
    }

}
