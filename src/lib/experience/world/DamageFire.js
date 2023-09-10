import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { BodyGroup, VisorType } from '../../enums';
import threeParticleFire from 'three-particle-fire';
import { tweened } from 'svelte/motion';
import { appState } from '../../stores';
import { AppState } from '../../enums';
import { ScanType } from '../scanData';

threeParticleFire.install({ THREE: THREE });

export default class DamageFire {
	constructor(world, position) {
		// References
		this.world = world;
		this.scene = this.world.scene;
		this.samus = this.world.samus;
		this.listener = this.samus.listener;
		this.camera = this.samus.camera;
		this.resources = this.world.resources;
		this.time = this.world.time;
		this.sizes = this.world.experience.sizes;

		this.physicsWorld = this.world.physicsWorld;
		this.position = position;

		// Setup
		this.setModel();
		// this.setMaterials();
		this.setStores();
		this.setLight();
		this.setBody();
		this.setCollisionEvent();
		this.setTimeEvent();
		this.setSound();
		this.spawn();
	}

	/* 
        Setup
    */
	// setMaterials() {
	// 	this.combatTexture = this.material.uniforms.map.value;
	// 	// console.log(this.material.uniforms.map.value);
	// 	this.thermalTexture = this.resources.items.thermalHotTexture;
	// 	this.xrayTexture = this.resources.items.xraySolidTexture;
	// }

	setStores() {
		this.soundVolume = tweened(0, { duration: 200 });

		this.soundVolume.subscribe((value) => {
			if (this.sound) {
				this.sound.setVolume(value);
			}
		});

		appState.subscribe(value => {
			switch (value) {
				case AppState.Dying:
					this.pauseSound();
			}
		})

		// // Materials
		// currentVisor.subscribe((value) => {
		// 	if (!this.model) return;

		// 	// Set material based on visor
		// 	switch (value) {
		// 		case VisorType.Combat:
		// 		case VisorType.Scan:
		// 			this.updateMaterial(this.combatTexture);
		// 			// console.log('scan');
		// 			break;
		// 		case VisorType.Thermal:
		// 			this.updateMaterial(this.thermalTexture);
		// 			// console.log('thermal');
		// 			break;
		// 		case VisorType.Xray:
		// 			this.updateMaterial(this.xrayTexture);
		// 			// console.log('xray');
		// 			break;
		// 	}
		// });
	}

	setModel() {
		// Model
		this.model = new THREE.Group();

		// Material
		this.material = new threeParticleFire.Material({ color: 'orange' });
		this.material.setPerspective(this.camera.fov, this.sizes.height);
		// this.combatTexture = this.material.uniforms
		// console.log(this.material.uniforms);
		
		// Geometry
		const geometry = new threeParticleFire.Geometry(1, 5, 1000);
		this.fire = new THREE.Points(geometry, this.material);
		this.model.add(this.fire);

		// Type
		this.model.scanType = ScanType.Fire;
	}

	setLight() {
		this.light = new THREE.PointLight('orange', 100);
		this.light.distance = 30;
		this.model.add(this.light);
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
		// // Setup collision event
		// this.body.addEventListener('collide', (event) => {
		// 	// console.log('colliding')
		// 	this.setTrigger();
		// });

		this.isColliding = false;

		this.physicsWorld.addEventListener('beginContact', () => {
			const oldCollide = this.isColliding;
			this.isColliding = this.getIsColliding(this.body, this.samus.body);
			if (this.isColliding && !oldCollide) {
				this.samus.setDamageOverTime(50);
				this.playSound();
			}
		});

		this.physicsWorld.addEventListener('endContact', () => {
			const oldCollide = this.isColliding;
			this.isColliding = this.getIsColliding(this.body, this.samus.body);
			if (!this.isColliding && oldCollide) {
				this.samus.setDamageOverTime(0);
				this.pauseSound();
			}
		});
	}

	setTimeEvent() {
		this.time.addEventListener('tick', (event) => {
			this.update();
		});
	}

	setSound() {
		this.soundBuffer = this.resources.items.burningSound;
		this.sound = new THREE.Audio(this.listener);
		this.sound.buffer = this.soundBuffer;
		this.sound.setVolume(0.15);
		this.sound.loop = true;
	}

	// setTrigger() {
	// 	if (!this.world.objectsToTrigger.includes(this)) {
	// 		this.world.objectsToTrigger.push(this);
	// 	}
	// }

	/* 
        Actions
    */
	spawn() {
		this.model.isAlive = true;
		this.body.position.copy(this.position);
		this.model.position.copy(this.body.position);
		this.scene.add(this.model);
		this.physicsWorld.addBody(this.body);
		this.world.dangerMeshes.push(this.model);
		this.world.scannableMeshes.push(this.model);
	}

	playSound() {
		this.soundVolume.set(0.15);
		this.sound.play();
	}

	pauseSound() {
		this.soundVolume.set(0);
		// this.sound.pause();
	}

	// trigger() {
	// 	this.samus.updateCurrentHealth(-13);
	// 	// this.playSound();
	// 	// this.destroy();
	// }

	// updateMaterial(material) {
	// 	// console.log(this.fire.material);

	// 	// this.fire.material = material;

	// 	this.material.uniforms.map.value = material;
	// 	this.material.needsUpdate = true;
	// 	console.log(this.material.uniforms.map.value);

	// 	// console.log(this.fire.material);
	// }

	/* 
        Update
    */
	update() {
		// Update material
		this.fire.material.update(this.time.delta / 1000);

		// Flicker
		const flick1 = Math.sin((5 * this.time.run) / 1000);
		const flick2 = Math.sin((9 * this.time.run) / 1000);
		const flick3 = Math.sin((17 * this.time.run) / 1000);
		const flick4 = Math.sin((30 * this.time.run) / 1000);
		const combined = (flick1 + flick2 + flick3 + flick4) / 4;
		this.light.intensity = 300 + 150 * combined;
	}

	/* 
		Utilities
	*/
	getIsColliding(bodyA, bodyB) {
		for (const contact of this.physicsWorld.contacts) {
			if (
				(contact.bi === bodyA && contact.bj === bodyB) ||
				(contact.bi === bodyB && contact.bj === bodyA)
			) {
				return true;
			}
		}
		return false;
	}
}
