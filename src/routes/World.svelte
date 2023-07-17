<!-- LOGIC -->
<script>
	import { onMount } from 'svelte';
	import { start } from '../lib/scene.js';

	let element;

	onMount(() => {
		start(element);
	});
</script>

<!-- STRUCTURE -->
<canvas bind:this={element} />