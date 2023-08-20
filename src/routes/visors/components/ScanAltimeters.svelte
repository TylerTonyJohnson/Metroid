<script>
	import { lookPosition } from '../../../lib/stores';

	const maxOffset = 100; // Height percent
	$: altHeight = $lookPosition.x * maxOffset;
</script>

<div id="altimeters">
	<div class="altimeter left">
		<img class="altimeter-image" src="Scan Altimeter 1x.png" alt="decoration" />
		<div class="altimeter-bar-small" style="background-position-y: {altHeight / 2}%;" />
		<div class="altimeter-bar-large" style="background-position-y: {altHeight}%;" />
	</div>
	<div class="altimeter right">
		<img class="altimeter-image" src="Scan Altimeter 1x.png" alt="decoration" />
		<div class="altimeter-bar-small" style="background-position-y: {altHeight / 2}%;" />
		<div class="altimeter-bar-large" style="background-position-y: {altHeight}%;" />
	</div>
</div>

<style>
	#altimeters {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920/1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		perspective: 100vh;
	}

	.altimeter {
		position: absolute;
		width: calc(170% / 1920 * 100);
		height: calc(494% / 1080 * 100);
		top: 50%;
		translate: 0% -50%;
		transform-origin: center;
		transform: rotateY(30deg);
	}

	.altimeter-image {
		position: absolute;
		height: 100%;
	}

	.left {
		left: calc(336%/1920*100);
	}

	.right {
		right: calc(336% / 1920 * 100);
		scale: -1 1;
	}

	.altimeter-bar-small {
		position: absolute;
		width: calc(6% / 170 * 100);
		height: calc(194% / 494 * 100);
		left: 32%;
		top: 50%;
		translate: 0% -50%;
		background-image: url('Scan Altimeter Small 1x.png');
		background-size: contain;
	}

	.altimeter-bar-large {
		position: absolute;
		width: calc(10% / 170 * 100);
		height: calc(222% / 494 * 100);
		left: 18%;
		top: 50%;
		translate: 0% -50%;
		background-image: url('Scan Altimeter Large 1x.png');
        background-size: contain;
	}
</style>
