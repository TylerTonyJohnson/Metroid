
<script>
	import { lookPosition } from '../../../lib/stores';

    const maxOffset = 300;      // Height percent
    $: altHeight = $lookPosition.y * maxOffset;
</script>

<div id='altimeters'>
    <div class='altimeter left'>
        <div class="lines a" style="background-position-y: calc({altHeight}% + 0px);" />
        <div class="lines b" style="background-position-y: calc({altHeight}% + 8px);" />
        <div class="lines c" style="background-position-y: calc({altHeight}% + 16px);" />
        <div class="lines d" style="background-position-y: calc({altHeight}% + 24px);" />
    </div>
    <div class='altimeter right'>
        <div class="lines a" style="background-position-y: calc({altHeight}% + 0px);" />
        <div class="lines b" style="background-position-y: calc({altHeight}% + 8px);" />
        <div class="lines c" style="background-position-y: calc({altHeight}% + 16px);" />
        <div class="lines d" style="background-position-y: calc({altHeight}% + 24px);" />
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
    }

    .altimeter {
        position: absolute;
        top: 34%;
        width: 1.2%;
        height: 27.8%;
    }

    .altimeter.left {
        left: 6.4%;
        clip-path: polygon(0% 0%, 100% 5%, 100% 100%, 0% 95%);
    }
    .altimeter.right {
        right: 6.4%;
        clip-path: polygon(0% 5%, 100% 0%, 100% 95%, 0% 100%);
    }

    .lines {
		position: absolute;
		height: 100%;
        left: 50%;
        translate: -50% 0%;
        /* transition: all 0.1s linear; */
	}

    .lines.a {
		width: 100%;
		background: linear-gradient(to top, var(--altim-bright) 2px, transparent 0);
		background-size: auto var(--altim-spacing);
	}
	.lines.b {
		width: 60%;
		background: linear-gradient(to top, var(--altim-light) 2px, transparent 0);
		background-size: auto var(--altim-spacing);
	}
	.lines.c {
		width: 40%;
		background: linear-gradient(to top, var(--altim-med) 2px, transparent 0);
		background-size: auto var(--altim-spacing);
	}
	.lines.d {
		width: 100%;
		background: linear-gradient(to top, var(--altim-light) 2px, transparent 0);
		background-size: auto var(--altim-spacing);
	}
</style>