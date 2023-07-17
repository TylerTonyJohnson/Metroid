<script>
	import { onMount } from 'svelte';
	import { currentVisor, isRendering } from '../../../lib/stores';
	import * as THREE from 'three';
	import { listener } from '../../../lib/scene';
	import { VisorType } from '../../../lib/enums';

	onMount(() => {
		const scanSound = new THREE.Audio(listener);
		const thermalSound = new THREE.Audio(listener);
		const xraySound = new THREE.Audio(listener);

		const audioLoader = new THREE.AudioLoader();
		audioLoader.load('Scan Visor Sound.wav', function (buffer) {
			scanSound.setBuffer(buffer);
			scanSound.setVolume(0.25);
			scanSound.setLoop(true);
		});

		audioLoader.load('Thermal Visor Sound.wav', function (buffer) {
			thermalSound.setBuffer(buffer);
			thermalSound.setVolume(0.25);
			thermalSound.setLoop(true);
		});

		audioLoader.load('Xray Visor Sound.wav', function (buffer) {
			xraySound.setBuffer(buffer);
			xraySound.setVolume(0.25);
			xraySound.setLoop(true);
		});

		currentVisor.subscribe((value) => {
			switch (value) {
                case VisorType.Combat:
					scanSound.stop();
					thermalSound.stop();
					xraySound.stop();
					break;
				case VisorType.Scan:
					scanSound.play();
					thermalSound.stop();
					xraySound.stop();
					break;
				case VisorType.Thermal:
					scanSound.stop();
					thermalSound.play();
					xraySound.stop();
					break;
				case VisorType.Xray:
					scanSound.stop();
					thermalSound.stop();
					xraySound.play();
					break;
			}
		});

		isRendering.subscribe((value) => {
			switch (value) {
				case true:
					scanSound.setVolume(0.25);
					thermalSound.setVolume(0.25);
					xraySound.setVolume(0.25);
					break;
				case false:
					scanSound.setVolume(0);
					thermalSound.setVolume(0);
					xraySound.setVolume(0);
					break;
			}
		});
	});
</script>
