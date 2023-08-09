export default class Hangar {
	constructor(experience) {
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		// Setup
		this.resource = this.resources.items.hangarGLB;

		this.setModel();
	}

	setModel() {
		this.model = this.resource.scene;
		this.model.scale.set(16, 16, 16);
		this.model.rotation.y = -Math.PI / 2;

		this.scene.add(this.model);

		this.model.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
                child.receiveShadow = true;
			}
		});
	}
}
