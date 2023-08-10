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
		this.model = this.resource.scene;
		this.model.scale.set(8, 8, 8);
		this.model.rotation.y = -Math.PI / 2;

		this.scene.add(this.model);

		this.model.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
	}

    setMovement() {
        this.position = new THREE.Vector3(0, 0, 0);
        this.model.position.copy(this.position);
        this.amplitude = 1;
        this.speed = 1;
    }

    update() {
        this.model.position.y = this.position.y + this.amplitude * Math.sin(this.speed * this.time.elapsed / 1000);
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
