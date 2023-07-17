<script>
	import { isRendering, isLockable, isLocked, closestSeekerPosition } from '../../../lib/stores';
	import { mapRange } from '../../../lib/math';

	let opacity;

	$: aspect = window.innerWidth / window.innerHeight;
	$: matchingWidth = 100 / aspect;
	$: matchMin = (100 - matchingWidth) / 2;
	$: matchMax = matchingWidth + matchMin;

	$: x = (100 * ($closestSeekerPosition.x + 1)) / 2;
	$: y = 100 * (1 - ($closestSeekerPosition.y + 1) / 2);
	$: {
		switch (true) {
			case $isLocked:
				opacity = 0;
				break;
			case x < matchMin:
				opacity = mapRange(x, 0, matchMin, 0, 1);
				break;
			case x > matchMax:
				opacity = mapRange(x, matchMax, 100, 1, 0);
				break;
			default:
				opacity = 1;
				break;
		}
	}
</script>

{#if $isLockable}
	<svg
		class="cursor rotate"
		style="left: {x}%;
            top: {y}%;
			opacity: {opacity};"
		class:paused={!$isRendering}
		viewBox="0 0 540 540"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<!-- Arrows -->
		<path class="arrow" d="M267 108H270H273L275 105H280L270 122L260 105H265L267 108Z" />
		<path
			class="arrow"
			d="M131.204 353.598L129.704 351L128.204 348.402L124.606 348.17L122.106 343.84L141.828 344L132.106 361.16L129.606 356.83L131.204 353.598Z"
		/>
		<path
			class="arrow"
			d="M411.811 348.406L410.311 351.004L408.811 353.602L410.409 356.834L407.909 361.164L398.186 344.004L417.909 343.844L415.409 348.174L411.811 348.406Z"
		/>

		<!-- Boxes -->
		<path class="box" d="M263 102V95H277V102H273L271 105H270H269L267 102H263Z" />
		<path
			class="box"
			d="M128.008 360.062L121.946 363.562L114.946 351.438L121.008 347.938L123.008 351.402L126.606 351.634L127.106 352.5L127.606 353.366L126.008 356.598L128.008 360.062Z"
		/>
		<path
			class="box"
			d="M419.007 347.942L425.069 351.442L418.069 363.566L412.007 360.066L414.007 356.602L412.409 353.37L412.909 352.504L413.409 351.638L417.007 351.406L419.007 347.942Z"
		/>
	</svg>
{/if}

<style>
	.cursor {
		position: absolute;
		height: calc((540% / 1080) * 100);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: opacity 0.2s linear;
	}

	.rotate {
		animation: spin 5s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.paused {
		animation-play-state: paused;
	}

	.arrow {
		stroke: #add6eb;
		stroke-opacity: 0.8;
		stroke-width: 3;
		stroke-linejoin: round;
		transition: stroke 0.25s ease-out;
	}

	.box {
		fill: #477085;
		fill-opacity: 0.6;
	}
</style>