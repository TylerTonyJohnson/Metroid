<script>
	import { appState, currentVisor, isRendering, isScanning, isScanned } from '../../../lib/stores';
	import * as THREE from 'three';
	import { listener } from '../../../lib/scene';
	import { AppState, VisorType } from '../../../lib/enums';

	const scanSound = new THREE.Audio(listener);
	const scanningSound = new THREE.Audio(listener);
	const thermalSound = new THREE.Audio(listener);
	const xraySound = new THREE.Audio(listener);

	const audioLoader = new THREE.AudioLoader();
	audioLoader.load('Scan Visor Sound.wav', function (buffer) {
		scanSound.setBuffer(buffer);
		scanSound.setVolume(0.25);
		scanSound.setLoop(true);
	});

	audioLoader.load('Scanning Sound.wav', function (buffer) {
		scanningSound.setBuffer(buffer);
		scanningSound.setVolume(0.25);
		scanningSound.setLoop(true);
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

	// Choose sound by active visor
	$: {
		switch ($currentVisor) {
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
	}

	// Pausing sounds
	$: {
		if ($appState === AppState.Running) {
			scanSound.setVolume(0.25);
			scanningSound.setVolume(0.25);
			thermalSound.setVolume(0.25);
			xraySound.setVolume(0.25);
		} else {
			scanSound.setVolume(0);
			scanningSound.setVolume(0);
			thermalSound.setVolume(0);
			xraySound.setVolume(0);
		}
	}

	// Scanning Sound
	$: {
		if ($isScanning && !$isScanned) {
			scanningSound.play();
		} else {
			scanningSound.stop();
		}
	}
</script>
