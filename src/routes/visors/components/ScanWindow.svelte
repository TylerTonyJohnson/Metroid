<script>
	import { fly } from "svelte/transition";

	export let side;
    $: flyDistance = side === 'right' ? 100 : -100; 
</script>

<div id="frame" transition:fly={{x: flyDistance}}>
	<div class="window-container"
        class:left={side === 'left'}
        class:right={side === 'right'}>
        <div class='window-fuzz' style="background-image: url('Scan Result Window Seed 1x.png');"></div>
		<img class='window-frame-image' src="Scan Result Window 1x.png" alt="window" />
	</div>
</div>

<style>
	#frame {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920 / 1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
        perspective: 175vh;
	}

	.window-container {
		position: absolute;
		height: calc(858% / 1080 * 100);
		width: calc(373% / 1920 * 100);
		top: 50%;
		translate: 0 -50%;
	}

	.left {
        left: calc(90% / 1920 * 100);
        transform-origin: left;
        transform: rotateY(60deg);
	}

	.right {
        right: calc(90% / 1920 * 100);
        transform-origin: right;
        transform: rotateY(-60deg);
	}

    .window-frame-image {
        position: absolute;
        height: 100%;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
    }

    .window-fuzz {
        position: absolute;
        height: 97%;
        width: 97%;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        background-size: contain;
        border-radius: 8%;
    }
</style>
