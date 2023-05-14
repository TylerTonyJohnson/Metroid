<!-- LOGIC -->
<script>
	import { currentVisor, lookMovement, readoutShow, readoutMessage } from '../lib/stores';
	import { VisorType, SelectorType } from '../lib/enums';
	import CombatVisor from './visors/CombatVisor.svelte';
	import ScanVisor from './visors/ScanVisor.svelte';
	import ThermalVisor from './visors/ThermalVisor.svelte';
	import XrayVisor from './visors/XrayVisor.svelte';
	import HealthBar from './HealthBar.svelte';
	import Selector from './Selector.svelte';
	import ReadoutCenter from './readouts/ReadoutCenter.svelte';
	import CombatCursor from './visors/components/CombatCursor.svelte';

	const maxOffsetX = 1;
	const maxOffsetY = 1;

	$: offsetX = 50 + maxOffsetX * $lookMovement.x;
	$: offsetY = 50 + maxOffsetY * $lookMovement.y;
	$: balanceX = 50 - maxOffsetX *  $lookMovement.x;
	$: balanceY = 50 - maxOffsetY *  $lookMovement.y;

</script>

<!-- STRUCTURE -->
<div
	id="visor"
	style="
		left: {offsetX}%;
		top: {offsetY}%;
"
>
	<!-- VISOR LAYER -->
	{#if $currentVisor === VisorType.Combat}
		<CombatVisor />
	{:else if $currentVisor === VisorType.Scan}
		<!-- <ScanVisor /> -->
	{:else if $currentVisor === VisorType.Thermal}
		<!-- <ThermalVisor /> -->
	{:else if $currentVisor === VisorType.Xray}
		<!-- <XrayVisor /> -->
	{:else}
		<div>No Visor Available</div>
	{/if}

	<!-- CONTROLS -->
	<HealthBar />
	<Selector selectorType={SelectorType.Beam} />
	<Selector selectorType={SelectorType.Visor} />

	<!-- HELMET -->
	<img src="Helmet 1x.png" id="helmet" alt="helmet" />
</div>


<div 
	id='cursor'>
	{#if $currentVisor === VisorType.Combat}
		<CombatCursor/>
	{:else if $currentVisor === VisorType.Scan}
		<CombatCursor/>
	{:else if $currentVisor === VisorType.Thermal}
		<CombatCursor/>
	{:else if $currentVisor === VisorType.Xray}
		<CombatCursor/>
	{:else}
		<div>No Cursor Available</div>
	{/if}
</div>


{#if $readoutShow}
	<ReadoutCenter>{$readoutMessage}</ReadoutCenter>
{/if}

<!-- STYLE -->
<style>
	#visor {
		position: absolute;
		width: 102%;
		height: 102%;
		translate: -50% -50%;
		perspective: 800px;
		pointer-events: none;
		transition-property: left, top;
		transition-duration: 0.1s;
		transition-timing-function: ease-out;
	}

	#helmet {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}
</style>
