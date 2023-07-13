<!-- LOGIC -->

<script>
    import { onMount } from "svelte";
    import { start } from '../lib/scene.js';
    import { isRendering } from "../lib/stores.js";
	import Instructions from "./Instructions.svelte";

    let element;

    onMount(() => {
        start(element);
    });

</script>

<!-- STRUCTURE -->
{#if !$isRendering}
    <Instructions />
{/if}
<canvas bind:this={element} />