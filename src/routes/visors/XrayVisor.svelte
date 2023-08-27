<script>
	import { fade } from 'svelte/transition';
	import XrayAltimeter from './components/XrayAltimeter.svelte';
	import XrayDecor from './components/XrayDecor.svelte';
	import XrayDanger from './components/XrayDanger.svelte';
	import XrayAmmo from './components/XrayAmmo.svelte';
</script>

<div id="visor" transition:fade={{duration: '200'}}>
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
		height: 100%;
		width: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		opacity: 50%;
	}
</style>
