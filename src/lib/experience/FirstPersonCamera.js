import * as THREE from 'three';

export default class FirstPersonCamera {
	constructor(experience) {
		// Setup
		this.experience = experience;
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;
        this.debug = this.experience.debug;

		// Config
		this.setInstance();
	}

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 300);
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.updateProjectionMatrix();
	}
}
