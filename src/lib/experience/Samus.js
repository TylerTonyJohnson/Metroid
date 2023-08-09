import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Samus {
	constructor(experience) {
		// Setup
		this.experience = experience;
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;

		this.setCamera();
        this.setOrbitControls();
        // this.setPointerLockControls();

	}

	setCamera() {
		this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 300);
		this.camera.position.set(-10, 2, 0);
        this.scene.add(this.camera);
	}

    setOrbitControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
    }

    setPointerLockControls() {
        this.controls = new PointerLockControls(this.camera, this.canvas);
    }

    resizeCamera() {
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }

    setArmCannon() {
        
        this.resources = this.experience.resources;
        this.armCannonResource = this.resources.items.armCannonGLB;
        this.armCannon = this.armCannonResource.scene;

		this.armCannon.scale.set(5, 5, 5);
		this.armCannon.rotation.y = Math.PI / 2;

		this.scene.add(this.armCannon);

		this.armCannon.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
                child.receiveShadow = true;
			}
		});
    }

    update() {
        this.controls.update();
    }
}
