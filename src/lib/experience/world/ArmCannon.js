import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { BeamType, VisorType } from '../../enums';
import { currentBeam, currentVisor, lookMovement } from '../../stores';
import { tweened } from 'svelte/motion';
import PowerShot from './PowerShot';
import WaveShot from './WaveShot';
import IceShot from './IceShot';
import PlasmaShot from './PlasmaShot';
import { writable } from 'svelte/store';

export default class ArmCannon {
	constructor(samus) {
		this.samus = samus;
		this.time = this.samus.experience.time;
		this.resources = this.samus.experience.resources;
		this.listener = this.samus.listener;

		this.movementMax = Math.PI / 36;
		this.isActive = true;

		this.setStores();
		this.setModel();
		this.setBeamMeshes();
		this.setBeamSounds();
		this.setTimer();
	}

	setStores() {
		currentBeam.subscribe((value) => {
			this.$currentBeam = value;
		});

		lookMovement.subscribe((value) => {
			this.$lookMovement = value;
		});

		this.rotation = new tweened({ x: 0, y: 0 });

		this.rotation.subscribe((value) => {
			this.$rotation = value;
		});

        this.recoil = new tweened(0);

		currentVisor.subscribe((value) => {
			this.isActive = value !== VisorType.Scan;
		});
	}

	setModel() {
		this.resource = this.samus.experience.resources.items.armCannonGLB;
		this.model = this.resource.scene;

		this.model.rotation.y = 0;
		this.model.scale.set(0.25, 0.25, 0.25);
		this.model.position.set(
			-this.samus.radius * 0.5,
			-this.samus.height * 0.125,
			this.samus.radius - 0.25
		);

		this.samus.group.add(this.model);
	}

	setBeamMeshes() {
		// Power Beam
		const powerShotResource = this.resources.items.powerShotTexture;
		const powerShotGeo = new THREE.SphereGeometry(0.2);
		const powerShotMat = new THREE.MeshMatcapMaterial({ matcap: powerShotResource });
		this.powerShotMesh = new THREE.Mesh(powerShotGeo, powerShotMat);

		// Wave Beam
		const waveShotResource = this.resources.items.waveShotTexture;
		const waveShotGeo = new THREE.SphereGeometry(0.1);
		const waveShotMat = new THREE.MeshMatcapMaterial({ matcap: waveShotResource });
		this.waveShotMesh = new THREE.Mesh(waveShotGeo, waveShotMat);

		// Ice Beam
		const iceShotResource = this.resources.items.iceShotTexture;
		const iceShotGeo = new THREE.ConeGeometry(0.6, 2, 32);
		iceShotGeo.rotateX(-Math.PI / 2);
		const iceShotMat = new THREE.MeshMatcapMaterial({ matcap: iceShotResource });
		this.iceShotMesh = new THREE.Mesh(iceShotGeo, iceShotMat);

		// Plasma Beam
		const plasmaShotResource = this.resources.items.plasmaShotTexture;
		const plasmaShotGeo = new THREE.SphereGeometry(0.2);
		const plasmaShotMat = new THREE.MeshMatcapMaterial({ matcap: plasmaShotResource });
		this.plasmaShotMesh = new THREE.Mesh(plasmaShotGeo, plasmaShotMat);
	}

	setBeamSounds() {
		this.powerSoundResource = this.resources.items.powerBeamSound;
		this.waveSoundResource = this.resources.items.waveBeamSound;
		this.iceSoundResource = this.resources.items.iceBeamSound;
		this.plasmaSoundResource = this.resources.items.plasmaBeamSound;
	}

	setTimer() {
		this.coolDownTimer = 0;
		this.lastShotTime = this.time.run;
		this.lastShotDelta = 0;
		this.powerBeamTimer = 0.1;
		this.waveBeamTimer = 0.4;
		this.iceBeamTimer = 0.8;
		this.plasmaBeamTimer = 0.5;
	}

	/* 
        Actions
    */

	shootBeam() {
		if (!this.isActive) return;

		// See if the beam cooldown has happened
		this.lastShotDelta = (this.time.run - this.lastShotTime) / 1000;
		if (this.lastShotDelta < this.coolDownTimer) return;
		this.lastShotTime = this.time.run;

		// this.rotation.set({ x: 0, y: 0 }, { duration: 0 })
		switch (this.$currentBeam) {
			case BeamType.Power:
				const powerShot = new PowerShot(this);
				powerShot.shoot();
				this.playSound(this.powerSoundResource);
				this.coolDownTimer = this.powerBeamTimer;
				break;
			case BeamType.Wave:
				const waveShot = new WaveShot(this);
				waveShot.shoot();
				this.playSound(this.waveSoundResource);
				this.coolDownTimer = this.waveBeamTimer;
				break;
			case BeamType.Ice:
				const iceShot = new IceShot(this);
				iceShot.shoot();
				this.playSound(this.iceSoundResource);
				this.coolDownTimer = this.iceBeamTimer;
				break;
			case BeamType.Plasma:
				const plasmaShot = new PlasmaShot(this);
				plasmaShot.shoot();
				this.playSound(this.plasmaSoundResource);
				this.coolDownTimer = this.plasmaBeamTimer;
				break;
		}
	}

	playSound(resource) {
		const sound = new THREE.Audio(this.listener);
		sound.buffer = resource;
		sound.setVolume(0.15);
		sound.play();
	}

	update() {
		this.rotation.set({
			x: -this.$lookMovement.x * this.movementMax,
			y: -this.$lookMovement.y * this.movementMax
		});

		// Arm cannon
		this.model.rotation.x = this.$rotation.x;
		this.model.rotation.y = this.$rotation.y;
	}
}
