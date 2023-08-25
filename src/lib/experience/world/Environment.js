import * as THREE from 'three';
import { currentVisor } from '../../stores';
import { VisorType } from '../../enums';

export default class Environment {
	constructor(experience) {
		// Links
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.debug = this.experience.debug;

		// Setup
		// this.setDirectionalLight();
		this.setHemisphereLight();
		this.setPointLights();
		// this.setAmbientLight();
		this.setEnvironmentMap();
		this.setSpotlights();
		this.setFogs();
		this.setStores();
	}

	/* Setup */
	setStores() {
		currentVisor.subscribe((value) => {

			// Set material based on visor
			switch (value) {
				case VisorType.Combat:
				case VisorType.Scan:
					this.setFog(this.combatFog);
					break;
				case VisorType.Thermal:
					this.setFog(this.thermalFog);
					break;
				case VisorType.Xray:
					// materials = this.world.armCannonCombatMaterials;
					break;
			}
		});
	}

	setEnvironmentMap() {
		// Environment map
		this.environmentMap = {};
		this.environmentMap.intensity = 5;
		this.environmentMap.texture = this.resources.items.spaceEnvironmentExr;
		this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;
		this.environmentMap.texture.mapping = THREE.EquirectangularReflectionMapping;

		// Background image
		this.backgroundImage = {};
		this.backgroundImage.texture = this.resources.items.spaceEnvironmentPng;
		this.backgroundImage.texture.colorSpace = THREE.SRGBColorSpace;
		this.backgroundImage.texture.mapping = THREE.EquirectangularReflectionMapping;

		this.scene.environment = this.environmentMap.texture;
		this.scene.background = this.environmentMap.texture;
		this.scene.backgroundIntensity = 3;

		// this.environmentMap.updateMaterial = () => {
		// 	this.scene.traverse((child) => {
		// 		if (child.isMesh && child.material.isMeshStandardMaterial) {
		// 			child.material.envMap = this.environmentMap.texture;
		// 			child.material.envMapIntensity = this.environmentMap.intensity;
		// 			child.material.needsUpdate = true;
		// 		}
		// 	});
		// };

		// this.environmentMap.updateMaterial();
	}

	setPointLights() {
		this.pointLight1 = new THREE.PointLight('orange', 1600);
		this.pointLight1.position.set(0, -10, 8);
		this.pointLight1.distance = 50;
		this.pointLight2 = new THREE.PointLight('orange', 1600);
		this.pointLight2.position.set(0, -10, -8);
		this.pointLight2.distance = 50;
		this.pointLight3 = new THREE.PointLight('gray', 500);
		this.pointLight3.position.set(0, 10, 12);
		this.pointLight3.distance = 50;
		this.pointLight4 = new THREE.PointLight('gray', 500);
		this.pointLight4.position.set(0, 10, -12);
		this.pointLight4.distance = 50;
		this.pointLight5 = new THREE.PointLight('gray', 500);
		this.pointLight5.position.set(50, 10, 8);
		this.pointLight5.distance = 50;
		this.pointLight6 = new THREE.PointLight('gray', 500);
		this.pointLight6.position.set(50, 10, -8);
		this.pointLight6.distance = 50;

		this.scene.add(
			this.pointLight1,
			this.pointLight2,
			this.pointLight3,
			this.pointLight4,
			this.pointLight5,
			this.pointLight6
		);
	}

	setSpotlights() {
		// Spotlight
		this.spotlight = new THREE.SpotLight('orange', 5000);
		this.spotlight.position.set(2, -5, 0);
		this.spotlight.distance = 20;
		this.spotlight.angle = Math.PI / 4;
		this.spotlight.penumbra = 0.1;
		this.spotlight.decay = 2;
		// this.spotlight.castShadow = true;
		this.scene.add(this.spotlight);

		// Target
		this.spotlight.target = this.experience.world.betaMetroid.model;
		// console.log(this.experience.world.samus.group);
		// this.scene.add(this.spotlight.target);

		// Helper
		if (this.debug.isActive) {
			this.spotlightHelper = new THREE.SpotLightHelper(this.spotlight);
			this.scene.add(this.spotlightHelper);
			this.spotlightFolder = this.debug.gui.addFolder('Spotlight');
			this.spotlightFolder.add(this.spotlight, 'intensity').min(0).max(1000000).step(1);
			this.spotlightFolder
				.add(this.spotlight.position, 'x')
				.min(-50)
				.max(50)
				.step(0.001)
				.onChange(this.spotlightHelper.update());
			this.spotlightFolder
				.add(this.spotlight.position, 'y')
				.min(-50)
				.max(50)
				.step(0.001)
				.onChange(this.spotlightHelper.update());
			this.spotlightFolder
				.add(this.spotlight.position, 'z')
				.min(-50)
				.max(50)
				.step(0.001)
				.onChange(this.spotlightHelper.update());
		}
	}

	setDirectionalLight() {
		this.directionalLight = new THREE.DirectionalLight('white', 3);
		this.directionalLight.position.set(0, 1, 0);
		this.scene.add(this.directionalLight);
	}

	setHemisphereLight() {
		this.hemisphereLight = new THREE.HemisphereLight('gray', 'orange', 5);
		this.scene.add(this.hemisphereLight);
	}

	setAmbientLight() {
		this.ambientLight = new THREE.AmbientLight('orange', 5);
		this.scene.add(this.ambientLight);
	}

	setFogs() {
		this.combatFog = new THREE.Fog('orange', 0, 200);
		this.thermalFog = new THREE.Fog('#120618', 0, 1000);
		// this.scene.fog = this.fog;
	}

	/* 
		Actions
	*/
	setFog(fog) {
		console.log('setting fog');
		this.scene.fog = fog;
	}
}
