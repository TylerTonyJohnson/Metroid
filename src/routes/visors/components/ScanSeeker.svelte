<script>
	import { closestSeekerPosition } from '../../../lib/stores';

	$: aspect = window.innerWidth / window.innerHeight;

	// Calculate target's distance from center of screen
	$: dist = Math.sqrt(
		Math.pow($closestSeekerPosition.x * aspect, 2) + Math.pow($closestSeekerPosition.y, 2)
	);

	// Check if distance from center of screen is within threshold
	$: isSeeking = dist < 0.6;

	// Calculate where the seeker should be based on whether the target is in the threshold
	$: x = isSeeking ? (100 * ($closestSeekerPosition.x + 1)) / 2 : 50;
	$: y = isSeeking ? 100 * (1 - ($closestSeekerPosition.y + 1) / 2) : 50;

</script>

<img
	class="cursor"
	src="Scan Seeker 1x.png"
	style="
		left: {x}%;
        top: {y}%;"
	class:seeking={isSeeking}
	alt="Combat Seeker"
/>

<style>
	.cursor {
		position: absolute;
		height: calc((204% / 1080) * 100);
		translate: -50% -50%;
		transition-property: left, top;
		transition-timing-function: ease-out;
		transition-duration: 0.2s;
	}

	.seeking {
		transition-duration: 0s;
	}
</style>
