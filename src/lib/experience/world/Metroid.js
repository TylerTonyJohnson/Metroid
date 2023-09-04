import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { randomFloat } from '../../math';
import { currentVisor } from '../../stores';
import { VisorType, BodyGroup } from '../../enums';
import PowerShot from '../samus/PowerShot';
import IceShot from '../samus/IceShot';

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

	setStores() {
		currentVisor.subscribe((value) => {
			if (!this.model) return;

			// Set material based on visor
			switch (value) {
				case VisorType.Combat:
				case VisorType.Scan:
					this.setMaterials(this.world.metroidCombatMaterials);
					break;
				case VisorType.Thermal:
					this.setMaterial(this.world.thermalHotMaterial);
					break;
				case VisorType.Xray:
					this.setMaterial(this.world.xrayTransparentMaterial);
					break;
			}
		});
	}

	setModel() {
		this.resource = this.resources.items.metroidGLB;
		this.resource.scene.children[0].position.set(0.35, 0, 0);

		this.model = this.resource.scene.clone();
		this.model.scale.set(2, 2, 2);
		this.model.rotation.y = Math.PI / 2;
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
	}

	/* 
		Actions
	*/

	setMaterials(materials) {
		let i = 0;
		this.model.traverse((child) => {
			if (child.isMesh) {
				child.material = materials[i];
				i++;
			}
		});
	}

	setMaterial(material) {
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
		// Set time
		const thetaRotate = (this.rotationSpeed * this.direction * this.time.run) / 1000;
		const thetaBob = (this.bobSpeed * this.time.run) / 1000;
		const thetaWeave = (this.weaveSpeed * this.time.run) / 1000;
		const thetaTilt = (this.tiltSpeed * this.time.run) / 1000;
		const thetaPitch = (this.pitchSpeed * this.time.run) / 1000;

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
	}

	setTrigger() {
		if (!this.world.objectsToTrigger.includes(this)) {
			this.world.objectsToTrigger.push(this);
		}
	}

	damage(shot) {
		// Health
		this.currentHealth = Math.max(this.currentHealth - shot.damageValue, 0);
		if (this.currentHealth < 1) this.kill();

		// // Color
		// if (shot instanceof IceShot) {
		// 	// this.freeze();
		// } else {
		// 	// this.flash();
		// }
	}

	kill() {
		// this.playSound();
		this.model.isAlive = false;
		this.destroy();
	}

	freeze() {

	}

	// flash() {
	// 	this.model.traverse(child => {
	// 		if (child.isMesh) {
	// 			child.material.color.set('red');
	// 		}
	// 	})
	// }

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
}
