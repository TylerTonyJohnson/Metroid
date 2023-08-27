<script>
    import { fade } from 'svelte/transition';
	import ThermalAltimeter from './components/ThermalAltimeter.svelte';
	import ThermalDanger from './components/ThermalDanger.svelte';
	import ThermalAmmo from './components/ThermalAmmo.svelte';
	import ThermalDecor from './components/ThermalDecor.svelte';

</script>

<div id="visor" transition:fade={{duration: '200'}}>

	<!-- BACKDROP -->
	<svg id='backdrop'></svg>
	<!-- DECORATION -->
	<ThermalDecor />
	<!-- BARS -->
	<ThermalAltimeter />
	<ThermalDanger />
	<ThermalAmmo />
</div>

<style>
	:root {
		--fuzz-color: rgba(100, 20, 200, 0.1);
	}

	#visor {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		opacity: 50%;
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