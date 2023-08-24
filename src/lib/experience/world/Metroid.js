import * as THREE from 'three';
import { randomFloat } from '../../math';

export default class Metroid {
	static centerPoint = new THREE.Vector3(0, 3, 0);

	static radiusMin = 8;
	static radiusMax = 20;
	static heightMin = -4;
	static heightMax = 4;

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
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;
		this.world = this.experience.world;

		// Setup
		this.resource = this.resources.items.metroidGLB;
		this.setModel();
		this.setSpawn();

		// Debug
		if (this.debug.isActive) {
			this.setDebug();
		}
	}

	setModel() {
		this.model = this.resource.scene.clone();
		this.model.scale.set(2, 2, 2);
		this.model.rotation.y = Math.PI / 2;

		this.scene.add(this.model);
		this.world.lookableMeshes.push(this.model);
		this.world.targetableMeshes.push(this.model);
		this.world.scannableMeshes.push(this.model);

		// this.model.traverse((child) => {
		// 	if (child.isMesh) {
		// 		this.world.lookableMeshes.push(child);
		// // 		child.castShadow = true;
		// // 		child.receiveShadow = true;
		// // 		// child.material.transparent = false;
		// // 		// child.material.transmission = 0;
		// // 		child.material.needsUpdate = true;
		// 	}
		// });
	}

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
		this.weaveSpeed = randomFloat(Metroid.weaveSpeedMin, Metroid.weaveSpeedMax) * this.rotationSpeed;
		this.tiltAmp = randomFloat(Metroid.tiltMin, Metroid.tiltMax);
		this.tiltSpeed = randomFloat(Metroid.tiltSpeedMin, Metroid.tiltSpeedMax) * this.rotationSpeed;
		this.pitchAmp = randomFloat(Metroid.pitchMin, Metroid.pitchMax);
		this.pitchSpeed = randomFloat(Metroid.pitchSpeedMin, Metroid.pitchSpeedMax) * this.rotationSpeed;
	
		
		/* 
			Initial position, rotation
		*/
		// Position
		const x = Metroid.centerPoint.x + this.radiusX * Math.cos(this.thetaOffset);
		const y = Metroid.centerPoint.y + this.height;
		const z = Metroid.centerPoint.z + this.radiusZ * Math.sin(this.thetaOffset);
		
		this.model.position.set(x, y, z);

		// Rotation
		const rotation = -this.direction * (this.thetaOffset);
		this.model.rotation.y = rotation;
	}

	update() {
		// Set time
		const thetaRotate = this.rotationSpeed * this.direction * this.time.run / 1000;
		const thetaBob = this.bobSpeed * this.time.run / 1000;
		const thetaWeave = this.weaveSpeed * this.time.run / 1000;
		const thetaTilt = this.tiltSpeed * this.time.run / 1000;
		const thetaPitch = this.pitchSpeed * this.time.run / 1000;

		// Position
		const x = Metroid.centerPoint.x + (this.radiusX + this.weaveAmp * Math.sin(thetaWeave)) * Math.cos(this.thetaOffset + thetaRotate);
		const y = Metroid.centerPoint.y + this.height + this.bobAmp * Math.sin(thetaBob + this.thetaOffset);
		const z = Metroid.centerPoint.z + (this.radiusZ + this.weaveAmp * Math.sin(thetaWeave)) * Math.sin(this.thetaOffset + thetaRotate);
		this.model.position.set(x, y, z);

		// Rotation
		const rotation = -(this.thetaOffset + thetaRotate) + this.rotationOffset;
		const tilt = this.tiltAmp * Math.sin(thetaTilt + this.thetaOffset);
		const pitch = this.pitchAmp * Math.sin(thetaPitch + this.thetaOffset);
		this.model.rotation.set(pitch, rotation, tilt);
	}

	setDebug() {

	}

}
