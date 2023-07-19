<script>
	import { fade } from 'svelte/transition';
	import { lookMovement } from '../../../lib/stores';

	const maxTranslateX = 1; // Degrees
	const maxTranslateY = 1; // Degrees

	$: translateX = maxTranslateX * $lookMovement.x;
	$: translateY = maxTranslateY * $lookMovement.y;
</script>

<img class="decor" src="Xray Buffers 1x.png" alt="decoration" />
<img class="decor" src="Xray Frame 1x.png" alt="decoration" />
<img
	class="decor"
	style="transform: 
		translateX({-translateX}%)
		translateY({-translateY}%);"
	src="Xray Rounder 1x.png"
	alt="decoration"
/>

<style>
	.decor {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: transform 0.2s ease-out;
	}
</style>
