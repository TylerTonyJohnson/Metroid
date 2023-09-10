import * as THREE from 'three';
import Sizes from './utils/Sizes';
import Time from './utils/Time';
import Renderer from './Renderer';
import World from './world/World';
import Resources from './utils/Resources';
import sources from './sources';
import Debug from './utils/Debug';
import DebugCamera from './DebugCamera';
import FirstPersonCamera from './FirstPersonCamera';
import { appState } from '../stores';
import { AppState } from '../enums';

export default class Experience {
	constructor(canvas) {
		// Global access
		window.experience = this;

		// Options
		this.canvas = canvas;

		// Setup
		this.debug = new Debug();
		this.sizes = new Sizes();
		this.time = new Time();
		this.resources = new Resources(sources);
		this.world = new World(this);
		this.scene = this.world.scene;
		// this.camera = new DebugCamera(this);
		this.camera = new FirstPersonCamera(this);
		this.listener = new THREE.AudioListener();
		this.renderer = new Renderer(this);

		// appState.subscribe(value => {
		// 	this.$appState = value;
		// })

		// Resize event
		this.sizes.addEventListener('resize', (event) => {
			this.resize();
		});

		// Tick event
		this.time.addEventListener('tick', (event) => {
			this.update();
		});

		this.resources.addEventListener('loaded', (event) => {
			this.time.startTick();
		});
	}

	resize() {
		// console.log('experience resize');
		this.camera.resize();
		this.renderer.resize();
	}

	update() {

		// console.log('tick update in experience')
		if (this.debug.isActive) {
			this.debug.update();
			this.debug.stats.begin();
			// this.debugCamera.update();
		}

		this.world.update();
		this.renderer.update();

		if (this.debug.isActive) this.debug.stats.end();
	}
}
