<script>
	import { fade } from 'svelte/transition';
	import XrayAltimeter from './components/XrayAltimeter.svelte';
	import XrayDecoration from './components/XrayDecoration.svelte';
</script>

<div id="visor" transition:fade>

	<!-- BACKDROP -->
	<div id='backdrop'></div>
	<!-- DECORATION -->
	<XrayDecoration />
	<!-- BARS -->
	<XrayAltimeter />
	<!-- CURSOR -->
</div>

<style>
	#visor {
		position: absolute;
		inset: 0;
		font-family: 'vdl-gigajr', sans-serif;
		font-weight: 1000;
		font-style: normal;
		pointer-events: none;
		background-color: hsla(255, 70%, 20%, 0.3);
		filter: blur(0);  /* Just for resize functionality */
		backdrop-filter: invert(1) saturate(0.3) sepia(0.5) hue-rotate(180deg) contrast(2) brightness(0.5) blur(1px);
	}

	#backdrop {
		position: absolute;
		width: 100%;
		height: 100%;
		
	}
</style>
