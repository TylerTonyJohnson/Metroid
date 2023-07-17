<script>
	import { fade } from 'svelte/transition';
	import XrayAltimeter from './components/XrayAltimeter.svelte';
	import XrayDecor from './components/XrayDecor.svelte';
	import XrayDanger from './components/XrayDanger.svelte';
	import XrayAmmo from './components/XrayAmmo.svelte';
</script>

<div id="visor" transition:fade={{duration: '200'}}>

	<!-- BACKDROP -->
	<!-- <div id='backdrop'></div> -->
	<!-- DECORATION -->
	<XrayDecor />
	<!-- BARS -->
	<XrayAltimeter />
	<!-- CURSOR -->
	<XrayDanger />
	<XrayAmmo />
</div>

<style>
	#visor {
		position: absolute;
		inset: 0;
		font-family: 'vdl-gigajr', sans-serif;
		font-weight: 1000;
		font-style: normal;
		pointer-events: none;

	}

	#backdrop {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: hsla(255, 70%, 20%, 0.3);
		filter: blur(0);  /* Just for resize functionality */
		backdrop-filter: invert(1) saturate(0.3) sepia(0.5) hue-rotate(180deg) blur(1px);
	}
</style>
