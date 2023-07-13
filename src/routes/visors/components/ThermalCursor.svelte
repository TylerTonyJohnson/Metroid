<script>
	import { fade } from 'svelte/transition';
	import { lookMovement } from '../../../lib/stores';

    const maxTranslateX = 5; // Degrees
	const maxTranslateY = 5; // Degrees

	$: translateX = maxTranslateX * $lookMovement.x;
	$: translateY = maxTranslateY * $lookMovement.y;

</script>

<img
	id="seeker-cursor"
	src="Thermal Seeker 1x.png"
	alt="thermal-seeker"
    transition:fade
	style="transform: 
        translateX({-translateX}%)
        translateY({-translateY}%);
"/>

<style>
	#seeker-cursor {
		position: absolute;
		height: 55.55%; /* This keeps it aligned by screen height */
		left: 50%;
		top: 52.96%; /* This makes up for the thermal offset */
		translate: -50% -50%;
        transition-property: transform;
		transition-duration: 0.2s;
		transition-timing-function: ease-out;
	}
</style>
