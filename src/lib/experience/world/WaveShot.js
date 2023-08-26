import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { currentVisor } from '../../stores';
import { VisorType } from '../../enums';

export default class WaveShot {
	static fireVelocity = 8;
	static radiusMin = 0.1;
	static radiusMax = 0.3;
	static waveSpeed = 20;

	constructor(armCannon) {
		// References
		this.armCannon = armCannon;
		this.samus = this.armCannon.samus;
		this.scene = this.samus.scene;
		this.world = this.samus.world;
		this.physicsWorld = this.samus.world.physicsWorld;
		this.time = this.samus.experience.time;

		// Tick event
		this.time.addEventListener('tick', (event) => {
			this.update();
		});

		// Spawn
		this.setMesh();
		this.setStores();
		this.setBody();
		this.spawn();
		this.setRay();
	}

	// Setup
	setStores() {
		currentVisor.subscribe((value) => {
			if (!this.group) return;

			// Set material based on visor
			switch (value) {
				case VisorType.Combat:
				case VisorType.Scan:
					this.meshes.forEach(mesh => mesh.material = this.armCannon.waveShotCombatMaterial);
					break;
				case VisorType.Thermal:
					this.meshes.forEach(mesh => mesh.material = this.world.thermalHotMaterial);
					break;
				case VisorType.Xray:
					this.meshes.forEach(mesh => mesh.material = this.world.xrayTransparentMaterial);
					break;
			}
		});
	}

	setMesh() {
		this.group = new THREE.Group();
		this.group.quaternion.copy(this.samus.group.quaternion);
		this.radius = WaveShot.radiusMin;
		this.meshCount = 3;
		this.meshes = [];

		for (let i = 0; i < this.meshCount; i++) {
			const mesh = this.armCannon.waveShotMesh.clone();
			const theta = (2 * Math.PI * i) / this.meshCount + Math.PI / 2;
			const x = this.radius * Math.cos(theta);
			const y = this.radius * Math.sin(theta);
			mesh.position.set(x, y, 0);
			this.meshes.push(mesh);
			this.group.add(mesh);
		}
	}

	setBody() {
		// Generate
		const powerShotShape = new CANNON.Sphere(0.5);
		this.body = new CANNON.Body({ type: CANNON.Body.KINEMATIC });
		this.body.addShape(powerShotShape);

		// Configure position  and direction
		this.spawnPosition = this.samus.group.localToWorld(new THREE.Vector3(-0.2, -0.2, 1));
		this.body.position.copy(this.spawnPosition);
	}

	spawn() {
		// Set position
		this.group.position.copy(this.spawnPosition);

		// Set speed
		this.spawnDirection = new THREE.Vector3();
		this.samus.group.getWorldDirection(this.spawnDirection);

		// Add to scene
		this.scene.add(this.group);
		this.physicsWorld.addBody(this.body);

		// this.distanceThreshold = 10;
	}

	setRay() {
		this.rayCaster = new THREE.Raycaster(this.spawnPosition, this.spawnDirection, 0, 100);
	}

	/* 
    Actions
*/

	shoot() {
		// Set velocity to shoot velocity
		this.body.velocity.set(
			this.spawnDirection.x * WaveShot.fireVelocity,
			this.spawnDirection.y * WaveShot.fireVelocity,
			this.spawnDirection.z * WaveShot.fireVelocity
		);

		// Set distance at which to delete the shot
		const intersects = this.rayCaster.intersectObjects(this.world.shootableMeshes, false);
		if (intersects.length) {
			this.distanceThreshold = intersects[0].distance;
		} else {
			this.distanceThreshold = 100;
		}

		// Play the sound
	}

	// setMaterial(material) {
	// 	this.group.traverse((child) => {
	// 		if (child.isMesh) {
    //             console.log(material);
	// 			child.material = material;
    //             child.material.needsUpdate = true;
	// 		}
	// 	});
	// }

	/* 
        Update
    */

	update() {
		this.group.position.copy(this.body.position);
		this.group.updateMatrixWorld();

		// Get distance from start
		const distance = this.group.position.distanceTo(this.spawnPosition);
		if (distance > this.distanceThreshold) this.destroy();

		// Update pulsing
		this.radius =
			(WaveShot.radiusMax - WaveShot.radiusMin) *
				(Math.sin((WaveShot.waveSpeed * this.time.run) / 1000) + 1) +
			WaveShot.radiusMin;

		for (let i = 0; i < this.meshes.length; i++) {
			const theta = (2 * Math.PI * i) / this.meshes.length + Math.PI / 2;
			const x = this.radius * Math.cos(theta);
			const y = this.radius * Math.sin(theta);
			this.meshes[i].position.set(x, y, 0);
		}
	}

	destroy() {
		this.scene.remove(this.group);
		this.physicsWorld.removeBody(this.body);
	}
}
