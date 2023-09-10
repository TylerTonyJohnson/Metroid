import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { currentVisor } from '../../stores';
import { VisorType, BodyGroup } from '../../enums';
import { tweened } from 'svelte/motion';

export default class PlasmaShot {
	static fireVelocity = 40;

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
		this.damageValue = 30;

		// Spawn
		this.setMesh();
		this.setStores();
		this.setBody();
		this.setCollisionEvent();
		// this.setSound();
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

		this.heat = tweened(1, { duration: 200 });

		this.heat.subscribe(value => {
			this.$heat = value;
			if (this.$heat < 0.1) {
				this.destroy();
			}
		})
	}

	setMesh() {
		this.mesh = this.armCannon.plasmaShotMesh.clone();
		this.mesh.quaternion.copy(this.samus.group.quaternion);
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

	setCollisionEvent() {
		// Setup collision event
		this.body.addEventListener('collide', (event) => {
			// Deal damage
			event.body.parent.damage(this);

			// Trigger sound events
			this.setTrigger();

			// Destroy this object
			this.decompose();
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

	setTrigger() {
		if (!this.world.objectsToTrigger.includes(this)) {
			this.world.objectsToTrigger.push(this);
		}
	}

	trigger() {
		console.log('flah');
		// this.playSound();
	}

	/* 
		Update
	*/

	update() {
		const meshPosition = this.spawnPosition.clone().add(this.body.position).divideScalar(2);
		this.mesh.position.copy(meshPosition);

		
		// Get distance from start
		const distance = this.body.position.distanceTo(this.spawnPosition);
		this.mesh.scale.z = 3 * distance;
		if (distance > this.distanceThreshold) this.decompose();
	}

	decompose() {
		this.heat.set(0);
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
