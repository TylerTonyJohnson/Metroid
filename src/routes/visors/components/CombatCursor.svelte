<script>
	import { lookDistance, lookDistMin, lookDistMax } from '../../../lib/stores';

	const innerMin = 3; // percentage
	const innerMax = 10; // percentage
	const outerMin = 15; // percentage
	const outerMax = 32; // percentage

	$: filtered = 1 - Math.sqrt((Math.max(Math.min($lookDistance, $lookDistMax), $lookDistMin) - $lookDistMin)/($lookDistMax - $lookDistMin));

	// $: innerSize = scale(filtered, innerMin, innerMax);
	// $: outerSize = scale(filtered, outerMin, outerMax);
	const innerSize = innerMin;
	const outerSize = outerMin;

	function scale(inPercent, mapMin, mapMax) {
		return (mapMax - mapMin) * inPercent + mapMin;
	}
</script>

<div id="cursor">
	<div class="inner" style="height: {innerSize}%; ">
		<img src="CombatCursorInner.svg" alt="cursor-inner" />
	</div>
	<div class="outer a" style="height: {outerSize}%;">
		<img src="CombatCursorOuter.svg" alt="cursor-outer" />
	</div>
	<div class="outer b" style="height: {outerSize}%;">
		<img src="CombatCursorOuter.svg" alt="cursor-outer" />
	</div>
	<div class="outer c" style="height: {outerSize}%;">
		<img src="CombatCursorOuter.svg" alt="cursor-outer" />
	</div>
</div>

<style>
	#cursor {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		width: 170px;
		aspect-ratio: 1;
		border-radius: 50%;
		pointer-events: none;
	}

	.inner {
		position: absolute;
		display: flex;
		height: 20px;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: height 0.1s linear;
	}

	.outer {
		position: absolute;
		display: flex;
		height: 60px;
		left: 50%;
		top: 0;
		translate: -50% 0;
		transition: height 0.1s linear;
        transform-origin: 50% 85px;
	}

    /* .outer.a {
        
    } */
    .outer.b {
        rotate: 120deg;
    }
    .outer.a {
        rotate: 240deg;
    }
</style>
