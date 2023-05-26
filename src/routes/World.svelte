<!-- LOGIC -->

<script>
    import { onMount } from "svelte";
	import { set_input_type } from "svelte/internal";
    import { setup } from '../lib/scene.js';

    let element;

    onMount(() => {
        setup(element);
    });

</script>

<!-- STRUCTURE -->

<canvas bind:this={element} />