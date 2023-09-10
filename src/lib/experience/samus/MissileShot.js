import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { currentVisor, isLocked } from '../../stores';
import { VisorType, BodyGroup } from '../../enums';

export default class MissileShot {
	static fireVelocity = 10;

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
		this.seeker = this.samus.seeker;

		// Tick event
		this.time.addEventListener('tick', (event) => {
			this.update();
		});
		this.damageValue = 25;

		// Spawn
		this.setStores();
		// this.setMesh();
		this.setModel();
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
			if (!this.model) return;

			// Set material based on visor
			switch (value) {
				case VisorType.Combat:
				case VisorType.Scan:
					this.model.material = this.armCannon.powerShotCombatMaterial;
					break;
				case VisorType.Thermal:
					this.model.material = this.world.thermalHotMaterial;
					break;
				case VisorType.Xray:
					this.model.material = this.world.xrayTransparentMaterial;
					break;
			}
		});

		isLocked.subscribe((value) => {
			this.$isLocked = value;
		});
	}

	// setMesh() {
	// 	this.model = this.armCannon.powerShotMesh.clone();
	// 	this.model.quaternion.copy(this.samus.group.quaternion);
	// }

	setModel() {
		const resource = this.resources.items.missileExpansionGLB;
		this.model = resource.scene.clone();

		this.model.traverse((child) => {
			if (child.isMesh) {
				// child.material.emissive = 'white'
				child.material = child.material.clone();
				child.material.blending = THREE.AdditiveBlending;
			}
		});

		this.model.scale.set(0.1, 0.1, 0.1);
		this.model.children[0].rotation.set(Math.PI / 2, 0, 0);
		this.model.quaternion.copy(this.samus.group.quaternion);
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
		this.model.position.copy(this.spawnPosition);

		// Set speed
		this.spawnDirection = new THREE.Vector3();
		this.samus.group.getWorldDirection(this.spawnDirection);

		// Add to scene
		this.scene.add(this.model);
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
		this.targetDirection = new THREE.Vector3();
		this.currentDirection = this.spawnDirection.clone();
		// Set velocity to shoot velocity
		this.body.velocity.set(
			this.spawnDirection.x * MissileShot.fireVelocity,
			this.spawnDirection.y * MissileShot.fireVelocity,
			this.spawnDirection.z * MissileShot.fireVelocity
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
		if (this.$isLocked) {
			// console.log('locked');
			this.updateAimVector();
		}

		// Update position of mesh
		this.model.position.copy(this.body.position);

		// Get distance from start
		const distance = this.model.position.distanceTo(this.spawnPosition);
		if (distance > this.distanceThreshold) this.destroy();
	}

	destroy() {
		// Mesh
		this.scene.remove(this.model);

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

	/* 
		Utilities
	*/
	updateAimVector() {
		const seekerPosition = this.seeker.closestMesh.position;
		const missilePosition = this.body.position;

		// Figure out target vector
		this.targetDirection.subVectors(seekerPosition, missilePosition).normalize();

		// Lerp toward target vector
		this.currentDirection.lerp(this.targetDirection, 0.05);
		this.body.velocity.set(
			this.currentDirection.x * MissileShot.fireVelocity,
			this.currentDirection.y * MissileShot.fireVelocity,
			this.currentDirection.z * MissileShot.fireVelocity
		);
		this.model.lookAt(seekerPosition);
	}
}
