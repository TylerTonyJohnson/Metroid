import * as THREE from 'three';
import Environment from './Environment';

export default class World {
	constructor(experience) {
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		// Test mesh
		const testMesh = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshStandardMaterial()
		);
		this.scene.add(testMesh);

		// Wait for resources to load
		this.resources.addEventListener('loaded', () => {
            
			// Setup
			this.environment = new Environment(this.experience);
		});
	}
}
