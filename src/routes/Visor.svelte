<!-- LOGIC -->
<script>
	import { currentVisor } from '../lib/stores';
	import { VisorType, SelectorType } from '../lib/enums';
	import CombatVisor from './visors/CombatVisor.svelte';
	import ScanVisor from './visors/ScanVisor.svelte';
	import ThermalVisor from './visors/ThermalVisor.svelte';
	import XrayVisor from './visors/XrayVisor.svelte';
	import HealthBar from './HealthBar.svelte';
	import Selector from './Selector.svelte';
</script>

<!-- STRUCTURE -->
<div id="visor">
	<!-- VISOR LAYER -->
	{#if $currentVisor === VisorType.Combat}
		<CombatVisor />
	{:else if $currentVisor === VisorType.Scan}
		<ScanVisor />
	{:else if $currentVisor === VisorType.Thermal}
		<ThermalVisor />
	{:else if $currentVisor === VisorType.Xray}
		<XrayVisor />
	{:else}
		<div>No Visor Available</div>
	{/if}

	<!-- CONTROLS -->
	<HealthBar />
	<Selector selectorType={SelectorType.Beam} />
	<Selector selectorType={SelectorType.Visor} />

	<!-- HELMET -->
	<img src="Helmet.png" id="helmet" alt="helmet" />
</div>

<!-- STYLE -->
<style>
	#visor {
		position: absolute;
		inset: 0;
		perspective: 800px;
		pointer-events: none;
	}

	#helmet {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}
</style>
