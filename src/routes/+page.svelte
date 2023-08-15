<script>
	import World from './World.svelte';
	import Hud from './HUD.svelte';
	import Disclaimer from './Disclaimer.svelte';
	import ReadoutCenter from './readouts/ReadoutCenter.svelte';
	import {
		isRendering,
		readoutShow,
		readoutMessage,
		isLoaded,
		appState
	} from '../lib/stores';
	import Instructions from './Instructions.svelte';
	import PageLoader from './PageLoader.svelte';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { AppState } from '../lib/enums';
</script>

<div id="body">
	<World />
	<Hud />
	{#if $appState === AppState.None || $appState === AppState.Loading || $appState === AppState.Ready}
		<PageLoader />
	{/if}
	<!-- {#if loadStatus !== 'complete'}
		<PageBlocker />
	{/if} -->
	<!-- {#if !$isRendering}
		<Instructions />
	{/if} -->
	<!-- {#if !$hasDisclaimed}
		<Disclaimer />
	{/if} -->
	<!-- {#if $readoutShow}
		<ReadoutCenter>{$readoutMessage}</ReadoutCenter>
	{/if} -->
	<!-- {#if $navigationState === 'loading'}
		<PageLoader />
	{/if} -->
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
