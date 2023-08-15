import * as THREE from 'three';
import { appState } from '../../stores';
import { AppState } from '../../enums';

export default class Time extends THREE.EventDispatcher {
	constructor() {
		super();

		// Setup
		this.start = Date.now();
		this.current = this.start;
		this.run = 0;
		this.elapsed = 0;
		this.delta = 0;

		appState.subscribe((value) => {
			this.$appState = value;
		});
	}

	tick() {
		// Setup for next frame
		window.requestAnimationFrame(() => {
			this.tick();
		});

		// Calculate time values
		const currentTime = Date.now();
		this.delta = currentTime - this.current;
		this.current = currentTime;
		this.elapsed = this.current - this.start;

		// Run time
		if (this.$appState !== AppState.Paused) {
			this.run += this.delta;
			this.dispatchEvent({ type: 'tick' });
		}
	}

	startTick() {
		window.requestAnimationFrame(() => {
			this.tick();
		});
	}
}
