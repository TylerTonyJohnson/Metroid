import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { randomFloat } from '../../math';
import { currentVisor } from '../../stores';
import { VisorType, BodyGroup } from '../../enums';
import PowerShot from '../samus/PowerShot';
import IceShot from '../samus/IceShot';
import MissileShot from '../samus/MissileShot';
import WaveShot from '../samus/WaveShot';
import PlasmaShot from '../samus/PlasmaShot';
import { ScanType } from '../scanData';

export default class Metroid {
	static centerPoint = new THREE.Vector3(0, 3, 0);

	static radiusMin = 8;
	static radiusMax = 16;
	static heightMin = -6;
	static heightMax = 2;

	static speedMin = 0.25;
	static speedMax = 0.5;

	static bobMin = 0.5;
	static bobMax = 0.75;
	static bobSpeedMin = 4;
	static bobSpeedMax = 6;

	static weaveMin = 0.25;
	static weaveMax = 0.5;
	static weaveSpeedMin = 4;
	static weaveSpeedMax = 6;

	static tiltMin = Math.PI / 16;
	static tiltMax = Math.PI / 12;
	static tiltSpeedMin = 3;
	static tiltSpeedMax = 6;

	static pitchMin = Math.PI / 16;
	static pitchMax = Math.PI / 12;
	static pitchSpeedMin = 3;
	static pitchSpeedMax = 6;

	constructor(experience) {
		this.experience = experience;
		this.world = this.experience.world;
		this.listener = this.world.samus.listener;
		this.physicsWorld = this.world.physicsWorld;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

		// Setup
		this.setMaterials();
		this.setStores();
		this.setModel();
		this.setBody();
		// this.setCollisionEvent();
		// this.setSound();
		this.setSpawn();
		this.spawn();

		// Debug
		if (this.debug.isActive) {
			this.setDebug();
		}
	}

	/* 
		Setup
	*/
	setMaterials() {
		this.combatMaterial = this.world.metroidCombatMaterials;
		this.thermalMaterial = this.world.thermalHotMaterial.clone();
		this.xrayMaterial = this.world.xrayTransparentMaterial.clone();
		this.standardColor = new THREE.Color('white');
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
		this.resource = this.resources.items.metroidGLB;
		this.resource.scene.children[0].position.set(0.35, 0, 0);

		// Clone
		this.model = this.resource.scene.clone();
		this.model.traverse((child) => {
			if (child.isMesh) {
				child.material = child.material.clone();
			}
		});

		// Config
		this.model.scale.set(2, 2, 2);
		this.model.rotation.y = Math.PI / 2;

		// Type
		this.model.scanType = ScanType.Metroid;
	}

	setBody() {
		// Create body
		const shape = new CANNON.Sphere(1);
		this.body = new CANNON.Body({ type: CANNON.Body.DYNAMIC });
		this.body.addShape(shape);
		this.body.collisionResponse = false;
		this.body.collisionFilterGroup = BodyGroup.Enemies;
		this.body.collisionFilterMask = BodyGroup.Weapons;
		this.body.parent = this;
		// console.log(this.body);
	}

	// setCollisionEvent() {
	// 	// Setup collision event
	// 	this.body.addEventListener('collide', (event) => {
	// 		this.setTrigger();
	// 		// this.destroy();
	// 	});
	// }

	setSpawn() {
		/* 
			Individual variables
		*/
		this.radiusX = randomFloat(Metroid.radiusMin, Metroid.radiusMax);
		this.radiusZ = randomFloat(Metroid.radiusMin, Metroid.radiusMax);
		this.thetaOffset = randomFloat(0, Math.PI * 2);
		this.height = randomFloat(Metroid.heightMin, Metroid.heightMax);
		this.direction = Math.random() < 0.5 ? -1 : 1;
		this.rotationOffset = (Math.PI / 2) * (this.direction - 1);
		this.rotationSpeed = randomFloat(Metroid.speedMin, Metroid.speedMax);
		this.bobAmp = randomFloat(Metroid.bobMin, Metroid.bobMax);
		this.bobSpeed = randomFloat(Metroid.bobSpeedMin, Metroid.bobSpeedMax) * this.rotationSpeed;
		this.weaveAmp = randomFloat(Metroid.weaveMin, Metroid.weaveMax);
		this.weaveSpeed =
			randomFloat(Metroid.weaveSpeedMin, Metroid.weaveSpeedMax) * this.rotationSpeed;
		this.tiltAmp = randomFloat(Metroid.tiltMin, Metroid.tiltMax);
		this.tiltSpeed = randomFloat(Metroid.tiltSpeedMin, Metroid.tiltSpeedMax) * this.rotationSpeed;
		this.pitchAmp = randomFloat(Metroid.pitchMin, Metroid.pitchMax);
		this.pitchSpeed =
			randomFloat(Metroid.pitchSpeedMin, Metroid.pitchSpeedMax) * this.rotationSpeed;

		/* 
			Initial position, rotation
		*/
		// Position
		const x = Metroid.centerPoint.x + this.radiusX * Math.cos(this.thetaOffset);
		const y = Metroid.centerPoint.y + this.height;
		const z = Metroid.centerPoint.z + this.radiusZ * Math.sin(this.thetaOffset);

		this.body.position.set(x, y, z);

		// Rotation
		const rotation = -this.direction * this.thetaOffset;
		const yVector = new CANNON.Vec3(0, 1, 0);
		this.body.quaternion.setFromAxisAngle(yVector, rotation);

		// Health
		this.currentHealth = 100;
	}

	spawn() {
		// Add
		this.model.position.copy(this.body.position);
		this.scene.add(this.model);
		this.physicsWorld.addBody(this.body);

		// Arrays
		this.world.lookableMeshes.push(this.model);
		this.world.shootableMeshes.push(this.model);
		this.world.targetableMeshes.push(this.model);
		this.world.scannableMeshes.push(this.model);
		this.model.isAlive = true;
		this.isFrozen = false;
		this.uptime = 0;
	}

	/* 
		Actions
	*/

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

	// setSound() {
	// 	this.soundResource = this.resources.items.metroidDeathSound;
	// 	this.sound = new THREE.PositionalAudio(this.listener);
	// 	this.sound.buffer = this.soundResource;
	// 	this.model.add(this.sound);
	// 	this.sound.setVolume(1);
	// 	this.sound.setRefDistance(10);
	// }

	/* 
		Update
	*/

	update() {
		// Frozen
		if (this.isFrozen) {
			this.freezeTimer -= this.time.delta / 1000;
			if (this.freezeTimer >= 0) {
				return;
			} else {
				this.unfreeze;
			}
		}

		// Set time
		this.uptime += this.time.delta;
		const thetaRotate = (this.rotationSpeed * this.direction * this.uptime) / 1000;
		const thetaBob = (this.bobSpeed * this.uptime) / 1000;
		const thetaWeave = (this.weaveSpeed * this.uptime) / 1000;
		const thetaTilt = (this.tiltSpeed * this.uptime) / 1000;
		const thetaPitch = (this.pitchSpeed * this.uptime) / 1000;

		// Position
		const x =
			Metroid.centerPoint.x +
			(this.radiusX + this.weaveAmp * Math.sin(thetaWeave)) *
				Math.cos(this.thetaOffset + thetaRotate);
		const y =
			Metroid.centerPoint.y + this.height + this.bobAmp * Math.sin(thetaBob + this.thetaOffset);
		const z =
			Metroid.centerPoint.z +
			(this.radiusZ + this.weaveAmp * Math.sin(thetaWeave)) *
				Math.sin(this.thetaOffset + thetaRotate);
		this.body.position.set(x, y, z);

		// Rotation
		const rotation = -(this.thetaOffset + thetaRotate) + this.rotationOffset;
		const tilt = this.tiltAmp * Math.sin(thetaTilt + this.thetaOffset);
		const pitch = this.pitchAmp * Math.sin(thetaPitch + this.thetaOffset);
		this.model.rotation.set(pitch, rotation, tilt);
		this.model.position.copy(this.body.position);

		// Color
		this.model.traverse((child) => {
			if (child.isMesh) {
				child.material.color.lerp(this.standardColor, 0.05);
			}
		});
	}

	setTrigger() {
		if (!this.world.objectsToTrigger.includes(this)) {
			this.world.objectsToTrigger.push(this);
		}
	}

	damage(shot) {
		// // Color
		// if (shot instanceof IceShot) {
		// 	this.freeze();
		// } else {
		// 	if (!this.isFrozen) {
		// 		this.flash();
		// 	}
		// }
		// // Health
		// if (this.isFrozen && shot instanceof MissileShot) {
		// 	damage = shot.damageValue * 4;
		// } else {
		// 	damage = shot.damageValue;
		// }
		
		// Calculate damage and such
		let damage = 0;
		switch (true) {
			case shot instanceof PowerShot:
			case shot instanceof WaveShot:
			case !this.isFrozen && shot instanceof PlasmaShot:
			case !this.isFrozen && shot instanceof MissileShot:
				damage = shot.damageValue;
				this.flash();
				break;
			case shot instanceof IceShot:
				damage = shot.damageValue;
				this.freeze();
				break;
			case this.isFrozen && shot instanceof PlasmaShot:
				damage = shot.damageValue;
				this.unfreeze();
				this.flash();
				break;
			case this.isFrozen && shot instanceof MissileShot:
				damage = 4 * shot.damageValue;
				this.unfreeze();
				this.flash();
				break;
		}

		this.currentHealth = Math.max(this.currentHealth - damage, 0);
		if (this.currentHealth < 1) this.kill();
	}

	kill() {
		// this.playSound();
		this.model.isAlive = false;
		this.destroy();
	}

	freeze() {
		this.isFrozen = true;
		this.freezeTimer = 5;

		this.model.traverse((child) => {
			if (child.isMesh) {
				child.material.color.set('blue');
			}
		});
	}

	unfreeze() {
		this.isFrozen = false;
		this.freezeTimer = 0;
	}

	flash() {
		this.model.traverse((child) => {
			if (child.isMesh) {
				child.material.color.set('red');
			}
		});
	}

	destroy() {
		// Mesh
		this.scene.remove(this.model);

		// Body
		if (!this.world.bodiesToRemove.includes(this.body)) {
			this.world.bodiesToRemove.push(this.body);
		}

		// World arrays
		let index = this.world.metroids.indexOf(this);
		if (index > -1) {
			this.world.metroids.splice(index, 1);
		}
		index = this.world.lookableMeshes.indexOf(this.model);
		if (index > -1) {
			this.world.lookableMeshes.splice(index, 1);
		}
		index = this.world.shootableMeshes.indexOf(this.model);
		if (index > -1) {
			this.world.shootableMeshes.splice(index, 1);
		}
		index = this.world.targetableMeshes.indexOf(this.model);
		if (index > -1) {
			this.world.targetableMeshes.splice(index, 1);
		}
		index = this.world.scannableMeshes.indexOf(this.model);
		if (index > -1) {
			this.world.scannableMeshes.splice(index, 1);
		}

		// Events
		// this.body.removeEventListener('collide');
	}

	// trigger() {
	// 	this.playSound();
	// }

	// playSound() {
	// 	// this.sound.updateMatrixWorld();
	// 	this.sound.position.copy(this.model.position);
	// 	this.sound.play();

	// 	console.log(this.model);
	// }

	setDebug() {}

	/* 
		Utilities
	*/
}
