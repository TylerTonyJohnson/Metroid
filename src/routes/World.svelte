<!-- LOGIC -->
<script>
	import { onMount } from 'svelte';
	import { start } from '../lib/scene.js';
	import WorldSounds from './visors/components/WorldSounds.svelte';

	let element;

	onMount(() => {
		start(element);
	});
</script>

<!-- STRUCTURE -->
<canvas bind:this={element} />
<WorldSounds />