<script>
	import Visor from "./Visor.svelte";
	import ReadoutCenter from "./readouts/ReadoutCenter.svelte";
    import { readoutMessage, readoutShow } from "../lib/stores";

</script>

<div id='HUD'>
    <Visor />
    {#if $readoutShow}
        <ReadoutCenter>{$readoutMessage}</ReadoutCenter>
    {/if}
</div>

<style>
    #HUD {
        position: absolute;
        height: 100%;
        width: 100%;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        perspective: 800px;
        pointer-events: none;
    }
</style>