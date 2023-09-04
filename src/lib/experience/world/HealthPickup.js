import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { BodyGroup } from '../../enums';

class HealthSize {
    static Small = new HealthSize('small');
    static Medium = new HealthSize('medium');
    static Large = new HealthSize('large');
}

export default class HealthPickup {
	constructor(world) {
		// References
		this.world = world;
		this.time = this.world.time;
		this.scene = this.world.scene;
		this.samus = this.world.samus;
		this.resources = this.world.resources;
		this.listener = this.samus.listener;
		this.physicsWorld = this.world.physicsWorld;

		// Setup
		this.setType();
		this.setModel();
		this.setBody();
		this.setCollisionEvent();
		this.setTimeEvent();
		this.setSound();
		this.spawn();
	}

	/* 
        Setup
    */
	setType() {
		const healthSizeArray = Object.values(HealthSize);
		this.size = healthSizeArray[Math.floor(Math.random() * healthSizeArray.length)];
	}

	setModel() {
		const resource = this.resources.items.healthGLB;
		this.model = resource.scene;
		this.model.scale.set(0.25, 0.25, 0.25);

		const sphereMesh = this.model.children[0].children[1];
		// console.log(this.model.children[0].children[0]);

		switch (this.size) {
			case HealthSize.Small:
				sphereMesh.material.color.set('purple');
				break;
			case HealthSize.Medium:
				sphereMesh.material.color.set('red');
				break;
			case HealthSize.Large:
				sphereMesh.material.color.set('yellow');
				break;
		}

		// this.model.traverse(child => {
		// 	if (child.isMesh) {
		// 		child.material.blending = THREE.AdditiveBlending;

		// 	}
		// })
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

	setTimeEvent() {
		this.time.addEventListener('tick', (event) => this.update());
	}

	setSound() {
		this.soundResource = this.resources.items.healthPickupSound;
	}

	/* 
        Actions
    */
	spawn() {
		this.body.position.set(40, -7, 0);
		this.model.position.copy(this.body.position);
		this.scene.add(this.model);
		this.physicsWorld.addBody(this.body);
		this.world.scannableMeshes.push(this.model);
	}

	setTrigger() {
		if (!this.world.objectsToTrigger.includes(this)) {
			this.world.objectsToTrigger.push(this);
		}
	}

	destroy() {
		this.scene.remove(this.model);

		// Body
		if (!this.world.bodiesToRemove.includes(this.body)) {
			this.world.bodiesToRemove.push(this.body);
		}

		// World
		// this.world.damageBall = null;

		// Events
		this.body.removeEventListener('collide');
	}

	trigger() {
		// Heal
		switch (this.size) {
			case HealthSize.Small:
				this.samus.updateCurrentHealth(25);
				break;
			case HealthSize.Medium:
				this.samus.updateCurrentHealth(50);
				break;
			case HealthSize.Large:
				this.samus.updateCurrentHealth(100);
				break;
		}
		
		// Play sound
		this.playSound();
	}

	playSound() {
		const sound = new THREE.Audio(this.listener);
		sound.buffer = this.soundResource;
		sound.setVolume(0.15);
		sound.play();
	}

	/* 
		Update
	*/
	update() {
		if (!this.model) return;
		this.model.rotation.x = 1 * (this.time.run / 1000);
		this.model.rotation.y = 2 * (this.time.run / 1000);
		this.model.rotation.z = 1 * (this.time.run / 1000);
	}
}
