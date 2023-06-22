<script>
	import { fade } from 'svelte/transition';
	import { lookMovement, lookPosition, isLocked } from '../../../lib/stores';

	const maxTranslateX = 3; // Degrees
	const maxTranslateY = 3; // Degrees

	$: translateX = maxTranslateX * $lookMovement.x;
	$: translateY = maxTranslateY * $lookMovement.y;
</script>

<div
	id="seeker"
    transition:fade
	class:locked="{$isLocked}"
    style="transform: translateX({-translateX}%)
    		translateY({-translateY}%);
    ">

    <img
		class='rotator'
		src="Xray Seeker 1x.png"
		alt="decoration"
		style="transform: rotate({$lookPosition.x}turn);
    "/>
</div>
<img
	id="follower"
	src="Xray Follower 1x.png"
	alt="decoration"
    transition:fade
	class:locked="{$isLocked}"
	style="transform: 
        translateX({-translateX/3}%)
        translateY({-translateY/3}%);
"/>

<style>
	#seeker, #follower {
		position: absolute;
		aspect-ratio: 1;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition-property: transform, height;
		transition-duration: 0.2s;
		transition-timing-function: ease-out;
	}

	.rotator {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: none;
	}

	#seeker:not(.locked) {
		height: 45.93%;
	}

	#seeker.locked {
		height: 20%;
	}

	#follower:not(.locked) {
		height: 64.91%;
	}

	#follower.locked {
		height: 40%;
	}

</style>
