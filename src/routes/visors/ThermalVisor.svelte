<script>
    import { fade } from 'svelte/transition';
	import ThermalCursor from './components/ThermalCursor.svelte';
	import ThermalDecoration from './components/ThermalDecoration.svelte';
	import ThermalAltimeter from './components/ThermalAltimeter.svelte';
	import ThermalDanger from './components/ThermalDanger.svelte';
	import ThermalAmmo from './components/ThermalAmmo.svelte';

</script>

<div id="visor" transition:fade>

	<!-- BACKDROP -->
	<svg id='backdrop'></svg>
	<!-- DECORATION -->
	<ThermalDecoration />
	<!-- BARS -->
	<ThermalAltimeter />
	<ThermalDanger />
	<ThermalAmmo />
	<!-- CURSOR -->
	<ThermalCursor />
</div>

<style>
	:root {
		--fuzz-color: rgba(100, 20, 200, 0.1);
	}

	#visor {
		position: absolute;
		inset: 0;
		font-family: 'vdl-gigajr', sans-serif;
		font-weight: 1000;
		font-style: normal;
		pointer-events: none;
		/* backdrop-filter: sepia(1) hue-rotate(330deg) contrast(2) saturate(2);
		filter: blur(0); */
	}

	#backdrop {
		position: absolute;
		width: 100%;
		height: 100%;
		background: linear-gradient( to right,
		var(--fuzz-color), 
			transparent,
			var(--fuzz-color));
		background-size: 10px;
		animation: fuzz 30s linear infinite;
	}

	@keyframes fuzz {
		from {
			background-position: 0% 0%;
		}
		to {
			background-position: 100% 0%;
		}
	}

</style>