<script>
	import * as THREE from 'three';
	import { listener } from '../../../lib/scene';
    import { appState } from '../../../lib/stores';
	import { AppState } from '../../../lib/enums';

	// I want to move this I think.
	const ambientSound = new THREE.Audio(listener);

	let isLoaded = false;

	const audioLoader = new THREE.AudioLoader();
	audioLoader.load('Ambience.wav', function (buffer) {
		ambientSound.setBuffer(buffer);
		ambientSound.setVolume(0.25);
		ambientSound.setLoop(true);
		isLoaded = true;
	});

	// Pausing sounds
	$: {
		if ($appState === AppState.Running) {
            ambientSound.play();
		} else {
            ambientSound.pause();
		}
	}
</script>
