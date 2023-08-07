<!-- LOGIC -->
<script>
	import { onMount } from 'svelte';
	import { start } from '../lib/scene.js';
	import WorldSounds from './visors/components/WorldSounds.svelte';

	import Experience from '$lib/experience/Experience.js';

	let element;
	let experience

	// onMount(() => {
	// 	start(element);
	// });

	onMount(() => {
		const experience = new Experience(element);
	})
	
</script>

<!-- STRUCTURE -->
<canvas bind:this={element} />
<WorldSounds />