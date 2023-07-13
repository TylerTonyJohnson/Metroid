<script>
	import { lookPosition } from '../../../lib/stores';

    const maxOffset = 300;      // Height percent
    $: altHeight = $lookPosition.y * maxOffset;
</script>

<div id='altimeters'>

        <div class="altimeter left" style="background-position-y: {altHeight / 2}%;" />

        <div class="altimeter right" style="background-position-y: {altHeight / 2}%;" />
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
        width: 1.2%;
        height: 27.8%;
        top: 34%;
        background-image: url('Combat Altimeter 1x.png');
        background-size: contain;
    }

    .left {
        left: 6.4%;
        clip-path: polygon(0% 0%, 100% 5%, 100% 100%, 0% 95%);
    }
    .right {
        right: 6.4%;
        clip-path: polygon(0% 5%, 100% 0%, 100% 95%, 0% 100%);
    }

</style>