<script>
	import { lookPosition } from '../../../lib/stores';

	$: leftOffset =
		$lookPosition.y * 200 * Math.cos((30 * Math.PI) / 180) -
		$lookPosition.x * 300 * Math.sin((30 * Math.PI) / 180);
	$: rightOffset =
		$lookPosition.y * 200 * Math.cos((30 * Math.PI) / 180) +
		$lookPosition.x * 300 * Math.sin((30 * Math.PI) / 180);
</script>

<div id="altimeters">
	<div class="altimeter bot-left">
		<div class="lines a left" style="background-position-y: calc({leftOffset}% + 0px);" />
		<div class="lines b left" style="background-position-y: calc({leftOffset}% + 8px);" />
		<div class="lines c left" style="background-position-y: calc({leftOffset}% + 16px);" />
		<div class="lines d left" style="background-position-y: calc({leftOffset}% + 24px);" />
	</div>
	<div class="altimeter top-left">
		<div class="lines a left" style="background-position-y: calc({leftOffset}% + 0px);" />
		<div class="lines b left" style="background-position-y: calc({leftOffset}% + 8px);" />
		<div class="lines c left" style="background-position-y: calc({leftOffset}% + 16px);" />
		<div class="lines d left" style="background-position-y: calc({leftOffset}% + 24px);" />
	</div>
	<div class="altimeter bot-right">
		<div class="lines a right" style="background-position-y: calc({rightOffset}% + 0px);" />
		<div class="lines b right" style="background-position-y: calc({rightOffset}% + 8px);" />
		<div class="lines c right" style="background-position-y: calc({rightOffset}% + 16px);" />
		<div class="lines d right" style="background-position-y: calc({rightOffset}% + 24px);" />
	</div>
	<div class="altimeter top-right">
		<div class="lines a right" style="background-position-y: calc({rightOffset}% + 0px);" />
		<div class="lines b right" style="background-position-y: calc({rightOffset}% + 8px);" />
		<div class="lines c right" style="background-position-y: calc({rightOffset}% + 16px);" />
		<div class="lines d right" style="background-position-y: calc({rightOffset}% + 24px);" />
	</div>
</div>

<style>
	:root {
		--altim-width: 12px;
		--altim-spacing: 32px;
		--altim-light: hsl(200, 50%, 75%, 10%);
		--altim-med: hsl(200, 50%, 75%, 20%);
		--altim-bright: hsl(200, 50%, 75%, 30%);
	}

	#altimeters {
        position: absolute;
        height: 100%;
        aspect-ratio: 1920/1080;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
    }

	.altimeter {
		position: absolute;
		width: var(--altim-width);
		height: 20%;
		overflow: hidden;
	}

	.bot-left {
		rotate: 30deg;
		top: 33%;
		left: 19.5%;
		border-bottom-left-radius: var(--altim-width);
	}

	.bot-right {
		rotate: -30deg;
		top: 33%;
		right: 19.5%;
		border-bottom-right-radius: var(--altim-width);
	}

	.top-left {
		rotate: 30deg;
		top: 11%;
		left: 26.5%;
		border-top-left-radius: var(--altim-width);
	}

	.top-right {
		rotate: -30deg;
		top: 11%;
		right: 26.5%;
		border-top-right-radius: var(--altim-width);
	}

	.lines {
		position: absolute;
		height: 100%;
	}

	.lines.left {
		right: 0;
	}
	.lines.right {
		left: 0;
	}

	.lines.a {
		width: 100%;
		background: linear-gradient(to top, var(--altim-bright) 2px, transparent 0);
		background-size: auto var(--altim-spacing);
		/* background-position-y: 0px; */
	}
	.lines.b {
		width: 60%;
		background: linear-gradient(to top, var(--altim-light) 2px, transparent 0);
		background-size: auto var(--altim-spacing);
		/* background-position-y: 8px; */
	}
	.lines.c {
		width: 40%;
		background: linear-gradient(to top, var(--altim-med) 2px, transparent 0);
		background-size: auto var(--altim-spacing);
		/* background-position-y: 16px; */
	}
	.lines.d {
		width: 100%;
		background: linear-gradient(to top, var(--altim-light) 2px, transparent 0);
		background-size: auto var(--altim-spacing);
		/* background-position-y: 24px; */
	}
</style>
