<script>
	import { fade, fly } from 'svelte/transition';
	import ScanDecor from './components/ScanDecor.svelte';
	import ScanAltimeters from './components/ScanAltimeters.svelte';
	import ScanWindow from './components/ScanWindow.svelte';
	import { scanProgress } from '../../lib/stores';
	import ScanMessage from './components/ScanMessage.svelte';
</script>

<div id="visor" transition:fade={{ duration: '200' }}>
	<!-- DECORATION -->
	<ScanDecor />
	<!-- ALTIMETERS -->
	<ScanAltimeters />
	<!-- RESULTS -->
	{#if $scanProgress > 25}
		<ScanWindow side="left" />
	{/if}
	{#if $scanProgress > 50}
		<ScanWindow side="right" />
	{/if}
	{#if $scanProgress > 75}
		<ScanMessage />
	{/if}
</div>

<style>
	#visor {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}
</style>
