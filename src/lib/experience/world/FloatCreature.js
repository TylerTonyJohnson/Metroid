import * as THREE from 'three';
export default class FloatCreature {
	constructor(experience) {
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;

		// Setup
		this.resource = this.resources.items.floatCreatureGLB;

		this.setModel();
		this.setAnimation();
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

	setAnimation() {
		this.animation = {}
		this.animation.mixer = new THREE.AnimationMixer(this.model);
		this.animation.action = this.animation.mixer.clipAction(this.resource.animations[0]);
		this.animation.action.play();
	}

	update() {
		this.animation.mixer.update(this.time.delta / 1000);
	}
}
