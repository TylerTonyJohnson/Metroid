import * as THREE from 'three';

export default class Environment {
	constructor(experience) {
		// Links
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		// Setup
		this.setDirectionalLight();
		// this.setAmbientLight()
		this.setEnvironmentMap();
		// this.setFog();
	}

	setDirectionalLight() {
		this.directionalLight = new THREE.DirectionalLight('#ffffff', 4);
		this.directionalLight.castShadow = true;
		this.directionalLight.shadow.camera.far = 15;
		this.directionalLight.shadow.mapSize.set(1024, 1024);
		this.directionalLight.shadow.normalBias = 0.05;
		// this.directionalLight.shadow.bias = 1;
		this.directionalLight.position.set(3, 3, 2.25);
		this.scene.add(this.directionalLight);
	}

	// setAmbientLight() {

	// }

	setEnvironmentMap() {
		this.environmentMap = {};
		this.environmentMap.intensity = 5;
		this.environmentMap.texture = this.resources.items.spaceEnvironmentExr;
		this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;
		this.environmentMap.texture.mapping = THREE.EquirectangularReflectionMapping;
		// this.environmentMap.texture.rotation = Math.PI / 2;

		this.scene.environment = this.environmentMap.texture;
		this.scene.background = this.environmentMap.texture;
		this.scene.backgroundIntensity = 3;

		this.environmentMap.updateMaterial = () => {
			this.scene.traverse((child) => {
                if (child.isMesh && child.material.isMeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
				}
			});
		};

		this.environmentMap.updateMaterial();
	}

	setFog() {
		this.fog = new THREE.Fog( 0xffffff, 10, 200);
		this.scene.fog = this.fog;
	}
}
