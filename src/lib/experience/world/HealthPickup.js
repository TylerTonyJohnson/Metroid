import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { currentVisor } from '../../stores';
import { VisorType, BodyGroup } from '../../enums';
import { ScanType } from '../scanData';

class HealthSize {
	static Small = new HealthSize('small');
	static Medium = new HealthSize('medium');
	static Large = new HealthSize('large');
}

export default class HealthPickup {
	constructor(world, position) {
		// References
		this.world = world;
		this.time = this.world.time;
		this.scene = this.world.scene;
		this.samus = this.world.samus;
		this.resources = this.world.resources;
		this.listener = this.samus.listener;
		this.physicsWorld = this.world.physicsWorld;

		this.position = position;

		// Setup
		this.setMaterials();
		this.setStores();
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
	setMaterials() {
		// Get materials
		this.combatMaterial = this.world.healthCombatMaterials;
		this.thermalMaterial = this.world.thermalHotMaterial;
		this.xrayMaterial = this.world.xrayTransparentMaterial;
	}

	setStores() {
		currentVisor.subscribe((value) => {
			if (!this.model) return;

			// Set material based on visor
			switch (value) {
				case VisorType.Combat:
				case VisorType.Scan:
					this.updateMaterials(this.combatMaterial);
					// console.log('scan');
					break;
				case VisorType.Thermal:
					this.updateMaterial(this.thermalMaterial);
					// console.log('thermal');
					break;
				case VisorType.Xray:
					this.updateMaterial(this.xrayMaterial);
					// console.log('xray');
					break;
			}
		});
	}

	setType() {
		const healthSizeArray = Object.values(HealthSize);
		this.size = healthSizeArray[Math.floor(Math.random() * healthSizeArray.length)];
		// switch (this.size) {
		// 	case HealthSize.Small:
				
		// 		// console.log('small');
		// 		break;
		// 	case HealthSize.Medium:
				
		// 		// console.log('medium');
		// 		break;
		// 	case HealthSize.Large:
				
		// 		// console.log('large');
		// 		break;
		// }
	}

	setModel() {
		const resource = this.resources.items.healthGLB;

		// Clone mmodel
		this.model = resource.scene.clone(true);
		this.model.traverse((child) => {
			if (child.isMesh) {
				child.material = child.material.clone();
				// child.material.blending = THREE.AdditiveBlending;
			}
		});

		// Config model
		this.model.scale.set(0.25, 0.25, 0.25);

		// Set material by type
		const sphereMesh = this.model.children[0].children[1];

		switch (this.size) {
			case HealthSize.Small:
				sphereMesh.material.color.set('purple');
				this.model.scanType = ScanType.SmallEnergy;
				break;
			case HealthSize.Medium:
				sphereMesh.material.color.set('red');
				this.model.scanType = ScanType.MediumEnergy;
				break;
			case HealthSize.Large:
				sphereMesh.material.color.set('yellow');
				this.model.scanType = ScanType.LargeEnergy;
				break;
		}
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
			// this.destroy();
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
		this.model.isAlive = true;
		this.body.position.copy(this.position);
		this.model.position.copy(this.body.position);
		this.scene.add(this.model);
		this.physicsWorld.addBody(this.body);
		this.world.scannableMeshes.push(this.model);
	}

	updateMaterials(materials) {
		let i = 0;
		this.model.traverse((child) => {
			if (child.isMesh) {
				child.material = materials[i];
				i++;
			}
		});
	}

	updateMaterial(material) {
		this.model.traverse((child) => {
			if (child.isMesh) {
				child.material = material;
			}
		});
	}

	setTrigger() {
		if (!this.world.objectsToTrigger.includes(this)) {
			this.world.objectsToTrigger.push(this);
		}
	}

	destroy() {
		this.model.isAlive = false;
		this.scene.remove(this.model);

		// Body
		if (!this.world.bodiesToRemove.includes(this.body)) {
			this.world.bodiesToRemove.push(this.body);
		}

		// Events
		this.body.removeEventListener('collide');

		// Respawn
		setTimeout(() => {
			console.log('respawning');
			this.world.spawnHealthPickup(this.position);
		}, 2000);
	}

	trigger() {
		// Heal
		switch (this.size) {
			case HealthSize.Small:
				this.samus.updateCurrentHealth(10);
				break;
			case HealthSize.Medium:
				this.samus.updateCurrentHealth(20);
				break;
			case HealthSize.Large:
				this.samus.updateCurrentHealth(100);
				break;
		}

		// Play sound
		this.destroy();
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
