import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { currentVisor } from '../../stores';
import { VisorType, BodyGroup } from '../../enums';

export default class PlasmaShot {
	static fireVelocity = 20;

	constructor(armCannon) {
		// References
		this.armCannon = armCannon;
		this.samus = this.armCannon.samus;
		this.scene = this.samus.scene;
		this.world = this.samus.world;
		this.physicsWorld = this.samus.world.physicsWorld;
		this.time = this.samus.experience.time;

		// Config
		this.mesh = this.armCannon.plasmaShotMesh.clone();
		this.mesh.quaternion.copy(this.samus.group.quaternion);

		// Tick event
		this.time.addEventListener('tick', (event) => {
			this.update();
		});

		// Spawn
        this.setStores();
		this.setBody();
		this.spawn();
		this.setRay();
	}

	// Setup
	setStores() {
		currentVisor.subscribe((value) => {
			if (!this.mesh) return;

			// Set material based on visor
			switch (value) {
				case VisorType.Combat:
				case VisorType.Scan:
					this.mesh.material = this.armCannon.plasmaShotCombatMaterial;
					break;
				case VisorType.Thermal:
					this.mesh.material = this.world.thermalHotMaterial;
					break;
				case VisorType.Xray:
					this.mesh.material = this.world.xrayTransparentMaterial;
					break;
			}
		});
	}

	setBody() {
		// Generate
		const plasmaShotShape = new CANNON.Sphere(0.15);
		this.body = new CANNON.Body({ type: CANNON.Body.DYNAMIC });
		this.body.collisionResponse = false;
		this.body.collisionFilterGroup = BodyGroup.Weapons;
		this.body.collisionFilterMask = BodyGroup.Enemies;
		this.body.addShape(plasmaShotShape);

		// Configure position  and direction
		this.spawnPosition = this.samus.group.localToWorld(new THREE.Vector3(-0.3, -0.4, 1));
		this.body.position.copy(this.spawnPosition);
	}

	spawn() {
		// Set position
		this.mesh.position.copy(this.spawnPosition);

		// Set speed
		this.spawnDirection = new THREE.Vector3();
		this.samus.group.getWorldDirection(this.spawnDirection);

		// Add to scene
		this.scene.add(this.mesh);
		this.physicsWorld.addBody(this.body);

		// this.distanceThreshold = 10;
	}

	setRay() {
		this.rayCaster = new THREE.Raycaster(this.spawnPosition, this.spawnDirection, 0, 100);
	}

	shoot() {
		// Set velocity to shoot velocity
		this.body.velocity.set(
			this.spawnDirection.x * PlasmaShot.fireVelocity,
			this.spawnDirection.y * PlasmaShot.fireVelocity,
			this.spawnDirection.z * PlasmaShot.fireVelocity
		);

		// Set distance at which to delete the shot
		const intersects = this.rayCaster.intersectObjects(this.world.shootableMeshes, false);
		if (intersects.length) {
			this.distanceThreshold = intersects[0].distance;
		} else {
			this.distanceThreshold = 70;
		}

		// Play the sound
	}

	update() {
		this.mesh.position.copy(this.body.position);
		this.mesh.scale.z += (PlasmaShot.fireVelocity * 40 * this.time.delta) / 1000;

		// Get distance from start
		const distance = this.mesh.position.distanceTo(this.spawnPosition);
		if (distance > this.distanceThreshold) this.destroy();
	}

	destroy() {
		this.scene.remove(this.mesh);
		this.physicsWorld.removeBody(this.body);
	}
}
