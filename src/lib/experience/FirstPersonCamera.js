import * as THREE from 'three';
import { currentVisor } from '../stores';
import { VisorType } from '../enums';

export default class FirstPersonCamera {
	constructor(experience) {
		// Setup
		this.experience = experience;
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;
		this.debug = this.experience.debug;

		// Config
		// this.setStores();
		this.setInstance();
	}

	// setStores() {
	// 	currentVisor.subscribe((value) => {
	// 		if (!this.instance) return;

	// 		// Set material based on visor
	// 		switch (value) {
	// 			case VisorType.Combat:
	// 			case VisorType.Scan:
	// 			case VisorType.Thermal:
	// 				this.updatePlanes(0.1, 300);
	// 				break;
	// 			case VisorType.Xray:
	// 				this.updatePlanes(0.1, 20);
	// 				break;
	// 		}
	// 	});
	// }

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 300);
	}

	// updatePlanes(near, far) {
	// 	this.instance.near = near;
	// 	this.instance.far = far;
	// 	this.instance.updateProjectionMatrix();
	// }

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.updateProjectionMatrix();
	}
}
