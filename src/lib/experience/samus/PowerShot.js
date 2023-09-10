import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { currentVisor } from '../../stores';
import { VisorType, BodyGroup } from '../../enums';

const fireVelocity = 20;

export default class PowerShot {
	

	constructor(armCannon) {
		// References
		this.armCannon = armCannon;
		this.samus = this.armCannon.samus;
		this.scene = this.samus.scene;
		this.world = this.samus.world;
		// this.listener = this.samus.listener;
		this.resources = this.world.resources;
		this.physicsWorld = this.samus.world.physicsWorld;
		this.time = this.samus.experience.time;

		// Tick event
		this.time.addEventListener('tick', (event) => {
			this.update();
		});
		this.damageValue = 5;

		// Spawn
		this.setMesh();
		this.setStores();
		this.setBody();
		this.setCollisionEvent();
		// this.setSound();
		this.spawn();
		this.setRay();
	}

	/* 
        Setup
    */
	setStores() {
		currentVisor.subscribe((value) => {
			if (!this.mesh) return;

			// Set material based on visor
			switch (value) {
				case VisorType.Combat:
				case VisorType.Scan:
					this.mesh.material = this.armCannon.powerShotCombatMaterial;
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

	setMesh() {
		this.mesh = this.armCannon.powerShotMesh.clone();
		this.mesh.quaternion.copy(this.samus.group.quaternion);
	}

	setBody() {
		// Generate
		const powerShotShape = new CANNON.Sphere(0.2);
		this.body = new CANNON.Body({ type: CANNON.Body.DYNAMIC });
		this.body.collisionResponse = false;
		this.body.collisionFilterGroup = BodyGroup.Weapons;
		this.body.collisionFilterMask = BodyGroup.Enemies;
		this.body.addShape(powerShotShape);

		// Configure position  and direction
		this.spawnPosition = this.samus.group.localToWorld(new THREE.Vector3(-0.2, -0.2, 1));
		this.body.position.copy(this.spawnPosition);
	}

	setCollisionEvent() {
		// Setup collision event
		this.body.addEventListener('collide', (event) => {
			// Deal damage
			event.body.parent.damage(this);

			// Trigger sound events
			this.setTrigger();

			// Destroy this object
			this.destroy();
		});
	}

	// setSound() {
	// 	this.soundResource = this.resources.items.enemyHitSound;
	// }

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

	/* 
		Actions
	*/

	shoot() {
		// Set velocity to shoot velocity
		this.body.velocity.set(
			this.spawnDirection.x * fireVelocity,
			this.spawnDirection.y * fireVelocity,
			this.spawnDirection.z * fireVelocity
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

	setTrigger() {
		if (!this.world.objectsToTrigger.includes(this)) {
			this.world.objectsToTrigger.push(this);
		}
	}

	trigger() {
		console.log('boom');
		// this.playSound();
	}

	/* 
		Update
	*/

	update() {
		this.mesh.position.copy(this.body.position);

		// Get distance from start
		const distance = this.mesh.position.distanceTo(this.spawnPosition);
		if (distance > this.distanceThreshold) this.destroy();
	}

	destroy() {
		// Mesh
		this.scene.remove(this.mesh);

		// Body
		if (!this.world.bodiesToRemove.includes(this.body)) {
			this.world.bodiesToRemove.push(this.body);
		}
	}

	// playSound() {
	// 	const sound = new THREE.Audio(this.listener);
	// 	sound.buffer = this.soundResource;
	// 	sound.playbackRate = 1;
	// 	sound.setVolume(0.15);
	// 	sound.play();
	// }
}
