import * as THREE from 'three';
import Sizes from './utils/Sizes';
import Time from './utils/Time';
import Samus from './Samus';
import Renderer from './Renderer';
import World from './world/World';
import Resources from './utils/Resources';
import sources from './sources';

export default class Experience {
	constructor(canvas) {
		// Global access
		window.experience = this;

		// Options
		this.canvas = canvas;

		// Setup
		this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.samus = new Samus(this);
        this.camera = this.samus.camera;

        this.renderer = new Renderer(this);
        this.world = new World(this);

        // Resize event
		this.sizes.addEventListener('resize', (event) => {
			this.resize();
		});

        // Tick event
        this.time.addEventListener('tick', (event) => {
            this.update();
        })
	}

	resize() {
		// console.log('experience resize');
        this.samus.resizeCamera();
        this.renderer.resize();
	}

    update() {
        // console.log('tick update in experience')
        this.samus.update();
        this.renderer.update();
    }
}
