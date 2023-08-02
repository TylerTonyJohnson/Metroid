<script>
	import * as THREE from 'three';
	import { listener } from '../../../lib/scene';
    import { isRendering } from '../../../lib/stores';


	const ambientSound = new THREE.Audio(listener);

	const audioLoader = new THREE.AudioLoader();
	audioLoader.load('Ambience.wav', function (buffer) {
		ambientSound.setBuffer(buffer);
		ambientSound.setVolume(0.25);
		ambientSound.setLoop(true);
	});

	// Pausing sounds
	$: {
		if (!$isRendering) {
            ambientSound.pause();
		} else {
            ambientSound.play();
		}
	}
</script>
