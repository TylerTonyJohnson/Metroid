import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { currentVisor } from '../../stores';
import { VisorType, BodyGroup } from '../../enums';
import { ScanType } from '../scanData';

export default class MissileExpansionPickup {
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
		this.combatMaterial = this.world.missileExpansionCombatMaterials;
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

	setModel() {
		const resource = this.resources.items.missileExpansionGLB;
		this.model = resource.scene;
		this.model.scale.set(0.25, 0.25, 0.25);

		this.model.traverse((child) => {
			if (child.isMesh) {
				// child.material.emissive = 'white'
				child.material.blending = THREE.AdditiveBlending;
			}
		});

		// Type
		this.model.scanType = ScanType.MissileExpansion;
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

	setTimeEvent() {
		this.time.addEventListener('tick', (event) => this.update());
	}

	setSound() {
		this.soundResource = this.resources.items.energyTankPickupSound;
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

		// World
		// this.world.damageBall = null;

		// Events
		this.body.removeEventListener('collide');

		// Respawn
		setTimeout(() => {
			console.log('respawning');
			this.world.spawnMissileExpansionPickup(this.position);
		}, 2000);
	}

	trigger() {
		this.samus.updateMaxAmmo(5);
		this.playSound();
		this.destroy();
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
		this.model.rotation.y = 2 * (this.time.run / 1000);
	}
}
