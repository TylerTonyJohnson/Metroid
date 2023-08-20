<script>
	import { lookPosition } from '../../../lib/stores';

	const vertOffset = 500;
	const horzOffset = 200;

	$: leftOffset =
		$lookPosition.x * horzOffset * Math.cos((30 * Math.PI) / 180) -
		$lookPosition.y * vertOffset * Math.sin((30 * Math.PI) / 180);
	$: rightOffset =
		$lookPosition.x * horzOffset * Math.cos((30 * Math.PI) / 180) +
		$lookPosition.y * vertOffset * Math.sin((30 * Math.PI) / 180);
</script>

<div id="frame">
	<div class="altimeter bot-left" style="background-position-y: {leftOffset}%;" />
	<div class="altimeter top-left" style="background-position-y: {leftOffset}%;" />
	<div class="altimeter bot-right" style="background-position-y: {rightOffset}%;" />
	<div class="altimeter top-right" style="background-position-y: {rightOffset}%;" />
</div>

<style>
	#frame {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920/1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.altimeter {
		position: absolute;
		width: calc(24% / 1920 * 100);
		height: calc(200% / 1080 * 100);
		overflow: hidden;
		background-image: url('Thermal Altimeter 1x.png');
		background-size: contain;
	}

	.bot-left {
		left: calc(372% / 1920 * 100);
		top: calc(350% / 1080 * 100);
		rotate: 30deg;
	}

	.top-left {
		left: calc(492% / 1920 * 100);
		top: calc(142% / 1080 * 100);
		rotate: 30deg;
	}

	.bot-right {
		right: calc(372% / 1920 * 100);
		top: calc(350% / 1080 * 100);
		rotate: -30deg;
		scale: -1 1;
	}

	.top-right {
		right: calc(492% / 1920 * 100);
		top: calc(142% / 1080 * 100);
		rotate: -30deg;
		scale: -1 1;
	}
</style>
