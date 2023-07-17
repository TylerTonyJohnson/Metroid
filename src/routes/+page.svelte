<script>
	import World from './World.svelte';
	import Hud from './HUD.svelte';
	import Disclaimer from './Disclaimer.svelte';
	import { hasDisclaimed, isRendering } from '../lib/stores';
	import Instructions from './Instructions.svelte';
</script>

<div id="body">
	<World />
	<Hud />
	{#if !$isRendering}
		<Instructions />
	{/if}
	{#if !$hasDisclaimed}
		<Disclaimer />
	{/if}
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	#body {
		width: 100vw;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}
</style>
