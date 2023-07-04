<script>
	import { onMount } from 'svelte';
	import { currentDanger, thresholdDanger, capDanger } from '../../../lib/stores';
	import * as THREE from 'three';
	import { listener } from '../../../lib/scene';
	let hasWarned = false;
	let hasDamaged = false;

	onMount(() => {
		const warnSound = new THREE.Audio(listener);
		const damageSound = new THREE.Audio(listener);

		const audioLoader = new THREE.AudioLoader();
		audioLoader.load('Danger Ping.wav', function (buffer) {
			warnSound.setBuffer(buffer);
			warnSound.setVolume(0.5);
			warnSound.setDetune(-1600);
			warnSound.setPlaybackRate(10);
		});
		audioLoader.load('Danger Ping.wav', function (buffer) {
			damageSound.setBuffer(buffer);
			damageSound.setVolume(0.5);
		});

		currentDanger.subscribe((value) => {
			if (value === $capDanger && !hasDamaged) {
				damageSound.play();
				hasDamaged = true;
			} else if (value >= $thresholdDanger && !hasWarned) {		
				warnSound.play();
				hasWarned = true;
				hasDamaged = false;
			} else if (value < $thresholdDanger) {
				hasWarned = false;
				hasDamaged = false;
			}
		});
	});
</script>

