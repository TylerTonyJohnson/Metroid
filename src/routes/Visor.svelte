<!-- LOGIC -->
<script>
	import { currentVisor, lookMovement } from '../lib/stores';
	import { VisorType, SelectorType } from '../lib/enums';
	import CombatVisor from './visors/CombatVisor.svelte';
	import ScanVisor from './visors/ScanVisor.svelte';
	import ThermalVisor from './visors/ThermalVisor.svelte';
	import XrayVisor from './visors/XrayVisor.svelte';
	import HealthBar from './HealthBar.svelte';
	import Selector from './Selector.svelte';
	import CombatCursor from './visors/components/CombatCursor.svelte';
	import CombatSeeker from './visors/components/CombatSeeker.svelte';
	import CombatLock from './visors/components/CombatLock.svelte';

	const maxRotateX = 1.5; // Degrees
	const maxRotateY = 1.5; // Degrees
	$: visorRotateX = maxRotateX * $lookMovement.x;
	$: visorRotateY = maxRotateY * $lookMovement.y;
</script>

<!-- STRUCTURE -->
<div id="visor">
	<div
		class="static-components"
		style="transform: rotateY({-visorRotateX}deg) 
	rotateX({visorRotateY}deg);
"
	>
		<div id="visor-layer">
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
		</div>
		<!-- CONTROLS -->
		<HealthBar />
		<Selector selectorType={SelectorType.Beam} />
		<Selector selectorType={SelectorType.Visor} />

		<!-- HELMET -->
		<img src="Helmet 1x.png" id="helmet" alt="helmet" />
	</div>
	<!-- SEEKER CURSOR -->
	<div id="seeker-layer">
		{#if $currentVisor === VisorType.Combat}
			<CombatSeeker />
		{:else if $currentVisor === VisorType.Scan}
			<CombatSeeker />
		{:else if $currentVisor === VisorType.Thermal}
			<CombatSeeker />
		{:else if $currentVisor === VisorType.Xray}
			<CombatSeeker />
		{:else}
			<div>No Cursor Available</div>
		{/if}
	</div>
	<!-- LOCK CURSOR -->
	<div id="lock-layer">
		{#if $currentVisor === VisorType.Combat}
			<CombatLock />
		{:else if $currentVisor === VisorType.Scan}
			<CombatLock />
		{:else if $currentVisor === VisorType.Thermal}
			<CombatLock />
		{:else if $currentVisor === VisorType.Xray}
			<CombatLock />
		{:else}
			<div>No Cursor Available</div>
		{/if}
	</div>

	<!-- BASIC CURSOR -->
	<div id="cursor-layer">
		{#if $currentVisor === VisorType.Combat}
			<CombatCursor />
		{:else if $currentVisor === VisorType.Scan}
			<CombatCursor />
		{:else if $currentVisor === VisorType.Thermal}
			<CombatCursor />
		{:else if $currentVisor === VisorType.Xray}
			<CombatCursor />
		{:else}
			<div>No Cursor Available</div>
		{/if}
	</div>
</div>

<!-- STYLE -->
<style>
	#visor {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		perspective: 800px;
	}

	#visor > * {
		position: absolute;

		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.static-components {
		width: 104%;
		height: 104%;
		transition-property: transform;
		transition-duration: 0.2s;
		transition-timing-function: ease-out;
	}

	#visor-layer {
		width: 104%;
		height: 104%;
	}

	#seeker-layer {
		width: 100%;
		height: 100%;
	}

	#lock-layer {
		width: 100%;
		height: 100%;
	}

	#cursor-layer {
		width: 100%;
		height: 100%;
	}

	#helmet {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}
</style>
