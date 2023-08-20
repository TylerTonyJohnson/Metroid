<script>
	import { lookPosition } from '../../../lib/stores';

	const maxOffset = 100; // Height percent
	$: altHeight = ($lookPosition.y + $lookPosition.x) * maxOffset;
</script>

<div id="frame">
	<div id='mask'>
		<div class="altimeter" style="rotate: {altHeight / 2}deg;" />
	</div>
</div>

<style>
	#frame {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920/1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		/* background-color: red; */
		clip-path: url(#myPath);

		/* clip-path: url(#svgPath); */
	}

	#mask {
		position: absolute;
		width: calc(1720% / 1920 * 100);
		height: calc(540% / 1080 * 100);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
        clip-path: polygon(0% 3%, 100% 3%, 100% 97%, 0% 97%);
		
	}

	.altimeter {
		position: absolute;
		width: calc(1674% / 1720 * 100);
		height: calc(1674% / 540 * 100);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		background-image: url('Xray Altimeter Lines 1x.png');
		background-size: contain;
		/* clip-path: url(#xray-altimeter-clip); */
	}
</style>
