<script>
	import { fade } from 'svelte/transition';
	import ScanDecor from './components/ScanDecor.svelte';
	import ScanAltimeters from './components/ScanAltimeters.svelte';

</script>

<div id='visor' transition:fade>
	<!-- DECORATION -->
    <ScanDecor />
	<!-- ALTIMETERS -->
	<ScanAltimeters />
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