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
			warnSound.setDetune(-1200);
			warnSound.setPlaybackRate(0.25);
		});
		audioLoader.load('Danger Ping.wav', function (buffer) {
			damageSound.setBuffer(buffer);
			damageSound.setVolume(0.25);
		});

		currentDanger.subscribe((value) => {

			switch (true) {
				case value >= $capDanger:
					if (!hasDamaged) {
						damageSound.setLoop(true);
						damageSound.play();
						hasDamaged = true;
					}
					break;
				case value > $thresholdDanger:
					if (!hasWarned) {
						warnSound.play();
						hasWarned = true;
					}
					if (damageSound.isPlaying) damageSound.setLoop(false);
					console.log(damageSound.duration);
					hasDamaged = false;
					break;
				case value < $thresholdDanger:
					if (damageSound.isPlaying) damageSound.setLoop(false);
					hasWarned = false;
					hasDamaged = false;
					break;
			}
		});
	});


</script>

