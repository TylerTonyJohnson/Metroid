import * as THREE from 'three';

export default class Metroid {
	constructor(experience) {
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

		// Setup
		this.resource = this.resources.items.metroidGLB;

		this.setModel();
	}

	setModel() {
		this.model = this.resource.scene;
		this.model.scale.set(5, 5, 5);
		this.model.rotation.y = Math.PI / 2;

		this.scene.add(this.model);

		this.model.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
                child.receiveShadow = true;
			}
		});
	}

	update() {

	}
}
