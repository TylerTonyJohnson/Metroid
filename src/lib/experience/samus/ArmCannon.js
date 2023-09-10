import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { BeamType, VisorType } from '../../enums';
import { currentBeam, currentVisor, currentAmmo, lookMovement } from '../../stores';
import { tweened } from 'svelte/motion';
import PowerShot from './PowerShot';
import WaveShot from './WaveShot';
import IceShot from './IceShot';
import PlasmaShot from './PlasmaShot';
import MissileShot from './MissileShot';

export default class ArmCannon {
	constructor(samus) {
		this.samus = samus;
		this.world = this.samus.world;
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

		currentVisor.subscribe((value) => {
			if (!this.model) return;

			// Set material based on visor
			switch (value) {
				case VisorType.Combat:
					this.setMaterials(this.world.armCannonCombatMaterials);
					this.disarmRotation.set(0, { duration: 100 });
					break;
				case VisorType.Scan:
					this.setMaterials(this.world.armCannonCombatMaterials);
					this.disarmRotation.set(Math.PI/2, { duration: 200 });
					break;
				case VisorType.Thermal:
					this.setMaterial(this.world.thermalHotMaterial);
					this.disarmRotation.set(0, { duration: 100 });
					break;
				case VisorType.Xray:
					this.setMaterial(this.world.xrayTransparentMaterial);
					this.disarmRotation.set(0, { duration: 100 });
					break;
			}

			// Disable cannon while scanning
			this.isActive = value !== VisorType.Scan;
		});

		lookMovement.subscribe((value) => {
			this.$lookMovement = value;
		});

		currentAmmo.subscribe(value => {
			this.$currentAmmo = value;
		})

		// Private
		this.rotation = new tweened({ x: 0, y: 0 });

		this.rotation.subscribe((value) => {
			this.$rotation = value;
		});

		this.recoil = new tweened(0);

		this.recoil.subscribe((value) => {
			this.$recoil = value;
		});

		this.disarmRotation = new tweened(0);

		this.disarmRotation.subscribe(value => {
			this.$disarmRotation = value;
		})
	}

	setModel() {
		this.resource = this.samus.experience.resources.items.armCannonGLB;
		this.model = this.resource.scene;

		this.model.rotation.y = 0;
		this.model.scale.set(0.25, 0.25, 0.25);
		this.position = new THREE.Vector3(
			-this.samus.radius * 0.5,
			-this.samus.height * 0.125,
			this.samus.radius - 0.25
		);
		this.model.position.copy(this.position);

		this.samus.group.add(this.model);
	}

	setBeamMeshes() {
		// Power Beam
		const powerShotResource = this.resources.items.powerShotTexture;
		const powerShotGeo = new THREE.SphereGeometry(0.2);
		this.powerShotCombatMaterial = new THREE.MeshMatcapMaterial({ matcap: powerShotResource });
		this.powerShotMesh = new THREE.Mesh(powerShotGeo, this.powerShotCombatMaterial);

		// Wave Beam
		const waveShotResource = this.resources.items.waveShotTexture;
		const waveShotGeo = new THREE.SphereGeometry(0.2);
		this.waveShotCombatMaterial = new THREE.MeshMatcapMaterial({ matcap: waveShotResource });
		this.waveShotMesh = new THREE.Mesh(waveShotGeo, this.waveShotCombatMaterial);

		// Ice Beam
		const iceShotResource = this.resources.items.iceShotTexture;
		const iceShotGeo = new THREE.ConeGeometry(0.6, 2, 32);
		iceShotGeo.rotateX(-Math.PI / 2);
		this.iceShotCombatMaterial = new THREE.MeshMatcapMaterial({ matcap: iceShotResource });
		this.iceShotMesh = new THREE.Mesh(iceShotGeo, this.iceShotCombatMaterial);

		// Plasma Beam
		const plasmaShotResource = this.resources.items.plasmaShotTexture;
		const plasmaShotGeo = new THREE.SphereGeometry(0.2);
		this.plasmaShotCombatMaterial = new THREE.MeshMatcapMaterial({ matcap: plasmaShotResource });
		this.plasmaShotMesh = new THREE.Mesh(plasmaShotGeo, this.plasmaShotCombatMaterial);
	}

	setBeamSounds() {
		this.powerSoundResource = this.resources.items.powerBeamSound;
		this.waveSoundResource = this.resources.items.waveBeamSound;
		this.iceSoundResource = this.resources.items.iceBeamSound;
		this.plasmaSoundResource = this.resources.items.plasmaBeamSound;
		this.missileSoundResource = this.resources.items.missileSound;
	}

	setTimer() {
		this.coolDownTimer = 0;
		this.lastShotTime = this.time.run;
		this.lastShotDelta = 0;
		this.powerBeamTimer = 0.1;
		this.waveBeamTimer = 0.5;
		this.iceBeamTimer = 0.8;
		this.plasmaBeamTimer = 0.5;
		this.missileTimer = 1.0;
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
				this.recoil.set(0.1, { duration: 100 });
				break;
			case BeamType.Wave:
				const waveShot = new WaveShot(this);
				waveShot.shoot();
				this.playSound(this.waveSoundResource);
				this.coolDownTimer = this.waveBeamTimer;
				this.recoil.set(0.1, { duration: 100 });
				break;
			case BeamType.Ice:
				const iceShot = new IceShot(this);
				iceShot.shoot();
				this.playSound(this.iceSoundResource);
				this.coolDownTimer = this.iceBeamTimer;
				this.recoil.set(0.1, { duration: 100 });
				break;
			case BeamType.Plasma:
				const plasmaShot = new PlasmaShot(this);
				plasmaShot.shoot();
				this.playSound(this.plasmaSoundResource);
				this.coolDownTimer = this.plasmaBeamTimer;
				this.recoil.set(0.25, { duration: 100 });
				break;
		}
	}

	shootMissile() {
		if (!this.isActive) return;
		if (!this.$currentAmmo) return;

		// See if the beam cooldown has happened
		this.lastShotDelta = (this.time.run - this.lastShotTime) / 1000;
		if (this.lastShotDelta < this.coolDownTimer) return;
		this.lastShotTime = this.time.run;

		const missileShot = new MissileShot(this);
		missileShot.shoot();
		this.playSound(this.missileSoundResource);
		this.coolDownTimer = this.missileTimer;
		this.recoil.set(0.1, { duration: 100 });
		currentAmmo.update(n => n - 1);
	}

	playSound(resource) {
		const sound = new THREE.Audio(this.listener);
		sound.buffer = resource;
		sound.setVolume(0.15);
		sound.play();
	}

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

	/* 
        Update
    */

	update() {
		this.rotation.set({
			x: -this.$lookMovement.x * this.movementMax + this.$disarmRotation,
			y: -this.$lookMovement.y * this.movementMax
		});

		this.lastShotDelta = (this.time.run - this.lastShotTime) / 1000;
		if (this.lastShotDelta >= this.coolDownTimer / 2) this.recoil.set(0);

		// Arm cannon
		this.model.position.z = this.position.z - this.$recoil;
		this.model.rotation.x = this.$rotation.x;
		this.model.rotation.y = this.$rotation.y;
	}
}
