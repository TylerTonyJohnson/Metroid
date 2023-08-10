import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class DebugCamera {
	constructor(experience) {
		// Setup
		this.experience = experience;
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;
        this.debug = this.experience.debug;

		// Config
		this.setInstance();
		this.setOrbitControls();

		// Debug
		if (this.debug.isActive) {
			this.setDebug();
		}
	}

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 300);
		this.instance.position.set(-10, 2, 0);
		this.scene.add(this.instance);
	}

	setOrbitControls() {
		this.controls = new OrbitControls(this.instance, this.canvas);
		this.controls.enableDamping = true;
	}

	takeOver() {
		this.experience.renderer.camera = this.instance;
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.updateProjectionMatrix();
	}

	update() {
		this.controls.update();
	}

	setDebug() {
		this.debugFolder = this.debug.gui.addFolder('Debug Camera');
		this.debugFolder.add(this, 'takeOver');
	}
}
