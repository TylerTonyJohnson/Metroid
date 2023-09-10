<script>
	import World from './World.svelte';
	import Hud from './HUD.svelte';
	import ReadoutCenter from './readouts/ReadoutCenter.svelte';
	import { isRendering, readoutShow, readoutMessage, isLoaded, appState } from '../lib/stores';
	import Instructions from './Instructions.svelte';
	import PageLoader from './PageLoader.svelte';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { AppState } from '../lib/enums';
	import PauseScreen from './PauseScreen.svelte';
	import { scale } from 'svelte/transition';
</script>

<div id='backdrop'></div>
{#if $appState !== AppState.Dying}
	<div id="body" out:scale>
		<!-- {#if $appState !== AppState.Loading } -->
		<World />
		<Hud />
		<!-- {/if} -->
		{#if $appState === AppState.None || $appState === AppState.Loading || $appState === AppState.Ready}
			<PageLoader />
		{/if}
		{#if $appState === AppState.Paused}
			<PauseScreen />
		{/if}
	</div>
{/if}


<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	#backdrop {
		position: absolute;
		width: 100vw;
		height: 100vh;
		background-color: black;
	}

	#body {
		position: absolute;
		width: 100vw;
		height: 100vh;
		/* position: relative; */
		overflow: hidden;
	}
</style>
