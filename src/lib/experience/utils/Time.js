import * as THREE from 'three';

export default class Time extends THREE.EventDispatcher {
	constructor() {
		super();

		// Setup
		this.start = Date.now();
		this.current = this.start;
		this.elapsed = 0;
		this.delta = 0;

		// Start
		window.requestAnimationFrame(() => {
			this.tick();
		});
	}

	tick() {
        // Calculate time values
		const currentTime = Date.now();
		this.delta = currentTime - this.current;
		this.current = currentTime;
		this.elapsed = this.current - this.start;

        // Send updated time values for other functions
        this.dispatchEvent({ type: 'tick' });

        // Setup for next frame
		window.requestAnimationFrame(() => {
			this.tick();
		});
	}
}
