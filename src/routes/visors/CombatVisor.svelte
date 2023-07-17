<script>
	import { fade } from 'svelte/transition';
	import CombatAltimeters from './components/CombatAltimeters.svelte';
	import CombatDecor from './components/CombatDecor.svelte';
	import CombatDanger from './components/CombatDanger.svelte';
	import CombatAmmo from './components/CombatAmmo.svelte';
</script>

<div id='visor' transition:fade={{duration: '200'}}>
	<!-- DECORATION -->
	<CombatDecor />
	<!-- ALTIMETERS -->
	<CombatAltimeters />
	<!-- DANGER BAR -->
	<CombatDanger />
	<!-- AMMO BAR -->
	<CombatAmmo />
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
