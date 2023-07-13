<script>
	import { fade } from 'svelte/transition';
	import ScanDecor from './components/ScanDecor.svelte';
	import ScanAltimeters from './components/ScanAltimeters.svelte';
	import ScanProgress from './components/ScanProgress.svelte';
	import { isScanning } from '../../lib/stores';
</script>

<div id="visor" transition:fade>
	<!-- DECORATION -->
	<ScanDecor />
	<!-- ALTIMETERS -->
	<ScanAltimeters />

	{#if $isScanning}
		<ScanProgress />
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
