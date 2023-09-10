import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { BodyGroup } from '../../enums';

export default class DamagePickup {
	constructor(world, position) {
		// References
		this.world = world;
		this.scene = this.world.scene;
		this.samus = this.world.samus;
		this.resources = this.world.resources;
		this.listener = this.samus.listener;
		this.physicsWorld = this.world.physicsWorld;

		this.position = position;

		// Setup
		this.setMesh();
		this.setBody();
		this.setCollisionEvent();
		this.setSound();
		this.spawn();
	}

	/* 
        Setup
    */
	setMesh() {
		const geometry = new THREE.SphereGeometry(1);
		const material = new THREE.MeshBasicMaterial({ color: 'red' });
		this.model = new THREE.Mesh(geometry, material);
	}

	setBody() {
		// Create body
		const shape = new CANNON.Sphere(1);
		this.body = new CANNON.Body({ type: CANNON.Body.KINEMATIC });
		this.body.addShape(shape);
		this.body.collisionResponse = false;
		this.body.collisionFilterGroup = BodyGroup.Pickups;
		this.body.collisionFilterMask = BodyGroup.Samus;
	}

	setCollisionEvent() {
		// Setup collision event
		this.body.addEventListener('collide', (event) => {
			this.setTrigger();
		});
	}

	setSound() {
		this.soundResources = [
			this.resources.items.damageSound1,
			this.resources.items.damageSound2,
			this.resources.items.damageSound3,
			this.resources.items.damageSound4,
			this.resources.items.damageSound5,
			this.resources.items.damageSound6
		];
	}

	/* 
        Actions
    */
	spawn() {
		this.model.isAlive = true;
		this.body.position.copy(this.position);
		this.model.position.copy(this.body.position);
		this.scene.add(this.model);
		this.physicsWorld.addBody(this.body);
	}

	setTrigger() {
		if (!this.world.objectsToTrigger.includes(this)) {
			this.world.objectsToTrigger.push(this);
		}
	}

	destroy() {
		this.model.isAlive = false;
		// Mesh
		this.model.geometry.dispose();
		this.model.material.dispose();
		this.scene.remove(this.model);

		// Body
		if (!this.world.bodiesToRemove.includes(this.body)) {
			this.world.bodiesToRemove.push(this.body);
		}

		// World
		this.world.damageBall = null;

		// Events
		this.body.removeEventListener('collide');

		// Respawn
		setTimeout(() => {
			console.log('respawning');
			this.world.spawnHealthPickup(this.position);
		}, 2000);
	}

	trigger() {
		this.samus.updateCurrentHealth(-13);
		this.playSound();
		this.destroy();
	}

	playSound() {
		const sound = new THREE.Audio(this.listener);
		const soundChoice = Math.floor(Math.random() * this.soundResources.length);
		sound.buffer = this.soundResources[soundChoice];
		sound.setVolume(0.15);
		sound.play();
	}
}
