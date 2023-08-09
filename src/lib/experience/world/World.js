import * as THREE from 'three';
import Environment from './Environment';
import Hangar from './Hangar';
import FloatCreature from './FloatCreature';
import BetaMetroid from './BetaMetroid';
import Metroid from './Metroid';

export default class World {
	constructor(experience) {
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		// Wait for resources to load
		this.resources.addEventListener('loaded', () => {

			// Test mesh
			const testMesh = new THREE.Mesh(
				new THREE.BoxGeometry(1, 1, 1),
				new THREE.MeshPhysicalMaterial({
					// color: 'gray',
					transparent: true,
					roughnessMap: this.resources.items.dirtyGlassRoughness,
					opacity: 1,
					ior: 1.5,
					thickness: 1,
					transmission: 1
				})
			);
			this.scene.add(testMesh);

			// Setup
			this.hangar = new Hangar(this.experience);
			this.floatCreature = new FloatCreature(this.experience);
			this.betaMetroid = new BetaMetroid(this.experience);
			this.metroid = new Metroid(this.experience);
			this.environment = new Environment(this.experience);
			this.samus = this.experience.samus;
			this.samus.setArmCannon();
		});
	}

	update() {
		if (this.floatCreature) this.floatCreature.update();
	}
}
