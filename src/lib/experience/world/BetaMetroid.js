import * as THREE from 'three';
export default class BetaMetroid {
	constructor(experience) {
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

		// Setup
		this.resource = this.resources.items.betaMetroidGLB;
		this.setModel();
		this.setMovement();

		// Debug
		if (this.debug.isActive) {
			this.setDebug();
		}
	}

	setModel() {
		// Set internal variables
		this.position = new THREE.Vector3(0, 0, 0);
		this.scale = new THREE.Vector3(6, 6, 6);

		// Set model
		this.model = this.resource.scene;
		this.model.position.copy(this.position);
		this.model.scale.copy(this.scale);
		this.model.rotation.y = -Math.PI / 2;

		// Configure model
		this.model.traverse((child) => {
			if (child.isMesh) {
				// child.castShadow = true;
				// child.receiveShadow = true;
				child.material.transparent = false;
				child.material.transmission = 0;
				child.material.depthWrite = false;
				child.material.needsUpdate = true;
			}
		});
		this.model.renderOrder = 1;
		this.scene.add(this.model);
	}

	setMovement() {
		this.bobAmplitude = 0.5;
		this.bobSpeed = 1;

		this.squishAmplitude = 0.2;
		this.squishSpeed = 2;
	}

	update() {
		// Update internal time
		this.model.position.y =
			this.position.y + this.bobAmplitude * Math.sin((this.bobSpeed * this.time.run) / 1000);
		this.model.scale.x =
			this.scale.x + this.squishAmplitude * Math.cos((this.squishSpeed * this.time.run) / 1000);
		this.model.scale.y =
			this.scale.y + this.squishAmplitude * Math.sin((this.squishSpeed * this.time.run) / 1000);
		this.model.scale.z =
			this.scale.z + this.squishAmplitude * Math.sin((this.squishSpeed * this.time.run) / 1000);
	}

	setDebug() {
		this.debugFolder = this.debug.gui.addFolder('Beta Metroid');
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
		this.scaleFolder.add(this.model.scale, 'x').name('x').min(0.1).max(20).step(0.001);
		this.scaleFolder.add(this.model.scale, 'y').name('y').min(0.1).max(20).step(0.001);
		this.scaleFolder.add(this.model.scale, 'z').name('z').min(0.1).max(20).step(0.001);
	}
}
