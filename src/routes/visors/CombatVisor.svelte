<script>
	import { fade } from 'svelte/transition';
	import CombatAltimeters from './components/CombatAltimeters.svelte';
</script>

<div id='visor' transition:fade>
	<!-- DECORATION -->
	<img id='decor' src="Combat 1x.png" alt="helmet" />
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

	#visor > * {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

</style>
