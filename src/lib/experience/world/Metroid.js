import * as THREE from 'three';

export default class Metroid {
	constructor(experience) {
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;
		this.world = this.experience.world;

		// Setup
		this.resource = this.resources.items.metroidGLB;
		this.setModel();

		// Debug
		if (this.debug.isActive) {
			this.setDebug();
		}
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

	setDebug() {
		this.debugFolder = this.debug.gui.addFolder('Metroid');
		this.positionFolder = this.debugFolder.addFolder('position');
		this.positionFolder.add(this.model.position, 'x').name('x').min(-50).max(50).step(0.001);
		this.positionFolder.add(this.model.position, 'y').name('y').min(-50).max(50).step(0.001);
		this.positionFolder.add(this.model.position, 'z').name('z').min(-50).max(50).step(0.001);
		this.rotationFolder = this.debugFolder.addFolder('rotation');
		this.rotationFolder
			.add(this.model.rotation, 'x')
			.name('x')
			.min(-Math.PI)
			.max(Math.PI)
			.step(0.001);
		this.rotationFolder
			.add(this.model.rotation, 'y')
			.name('y')
			.min(-Math.PI)
			.max(Math.PI)
			.step(0.001);
		this.rotationFolder
			.add(this.model.rotation, 'z')
			.name('z')
			.min(-Math.PI)
			.max(Math.PI)
			.step(0.001);
		this.scaleFolder = this.debugFolder.addFolder('scale');
		this.scaleFolder.add(this.model.scale, 'x').name('x').min(-50).max(50).step(0.001);
		this.scaleFolder.add(this.model.scale, 'y').name('y').min(-50).max(50).step(0.001);
		this.scaleFolder.add(this.model.scale, 'z').name('z').min(-50).max(50).step(0.001);
	}

	update() {}
}
