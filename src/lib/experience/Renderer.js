import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { AppState } from '../enums';
import { appState, loadPercent } from '../stores';

export default class Renderer {
	constructor(experience) {
		//  Setup
		this.experience = experience;
		this.canvas = this.experience.canvas;
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.camera = this.experience.camera.instance;

		// Stores
		appState.subscribe((value) => {
			this.$appState = value;
		});

		this.setInstance();
        this.setComposer();
	}

	setInstance() {
		this.instance = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true
		});
		this.instance.useLegacyLights = false;
		this.instance.outputColorSpace = THREE.SRGBColorSpace;
		// this.instance.toneMapping = THREE.ReinhardToneMapping;
		// this.instance.toneMappingExposure = 1.75;
		this.instance.shadowMap.enabled = true;
		this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
		this.instance.setClearColor('#211d20');
		this.instance.setSize(this.sizes.width, this.sizes.height);
		this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
	}

    setComposer() {
        this.composer = new EffectComposer(this.instance);
        this.composer.setSize(this.sizes.width, this.sizes.height);
		this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.afterimagePass = new AfterimagePass();
        this.afterimagePass.enabled = false;
        this.composer.addPass(this.afterimagePass);
    }

	resize() {
		this.instance.setSize(this.sizes.width, this.sizes.height);
		this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

        this.composer.setSize(this.sizes.width, this.sizes.height);
		this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
		this.update();
	}

	update() {
		if (this.$appState === AppState.Loading) loadPercent.set(90);

		// this.instance.render(this.scene, this.camera);
        this.composer.render(this.scene, this.camera);

		if (this.$appState === AppState.Loading) {
			loadPercent.set(100);
            appState.set(AppState.Ready);
		}
	}
}
