<script>
	import { fade } from 'svelte/transition';
	import CombatAltimeters from './components/CombatAltimeters.svelte';
	import CombatDecor from './components/CombatDecor.svelte';
</script>

<div id='visor' transition:fade>
	<!-- DECORATION -->
	<CombatDecor />
	<!-- ALTIMETERS -->
	<CombatAltimeters />
</div>

<style>
	#visor {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}
</style>
