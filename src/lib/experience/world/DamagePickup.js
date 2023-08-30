import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { BodyGroup } from '../../enums';

export default class DamagePickup {
	constructor(world) {
		// References
		this.world = world;
		this.scene = this.world.scene;
		this.samus = this.world.samus;
		this.resources = this.world.resources;
		this.listener = this.samus.listener;
		this.physicsWorld = this.world.physicsWorld;

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
		this.mesh = new THREE.Mesh(geometry, material);
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
			this.destroy();
		});
	}

	setSound() {
		this.soundResources = [
			this.resources.items.damageSound1,
			this.resources.items.damageSound2,
			this.resources.items.damageSound3,
			this.resources.items.damageSound4,
			this.resources.items.damageSound5,
			this.resources.items.damageSound6,
		];
	}

	/* 
        Actions
    */
	spawn() {
		this.body.position.set(40, -7, -5);
		this.mesh.position.copy(this.body.position);
		this.scene.add(this.mesh);
		this.physicsWorld.addBody(this.body);
	}

	setTrigger() {
		if (!this.world.objectsToTrigger.includes(this)) {
			this.world.objectsToTrigger.push(this);
		}
	}

	destroy() {
		// Mesh
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
		this.scene.remove(this.mesh);

		// Body
		if (!this.world.bodiesToRemove.includes(this.body)) {
			this.world.bodiesToRemove.push(this.body);
		}

        // World
        this.world.damageBall = null;

		// Events
		this.body.removeEventListener('collide');
	}

	trigger() {
		this.samus.updateCurrentHealth(-13);
		this.playSound();
	}

	playSound() {
		const sound = new THREE.Audio(this.listener);
		const soundChoice = Math.floor(Math.random() * this.soundResources.length);
		sound.buffer = this.soundResources[soundChoice];
		sound.setVolume(0.15);
		sound.play();
	}
}
