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
		this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
		this.camera.position.set(0, 2, 10);
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

    update() {
        this.controls.update();
    }
}
