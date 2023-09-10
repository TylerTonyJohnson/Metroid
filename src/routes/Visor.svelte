<!-- LOGIC -->
<script>
	import { currentVisor, lookMovement, isScanning } from '../lib/stores';
	import { VisorType, SelectorType } from '../lib/enums';
	import CombatVisor from './visors/CombatVisor.svelte';
	import ThermalVisor from './visors/ThermalVisor.svelte';
	import XrayVisor from './visors/XrayVisor.svelte';
	import CombatCursor from './visors/components/CombatCursor.svelte';
	import CombatSeeker from './visors/components/CombatSeeker.svelte';
	import CombatLock from './visors/components/CombatLock.svelte';
	import ScanSeeker from './visors/components/ScanSeeker.svelte';
	import ScanCursor from './visors/components/ScanCursor.svelte';
	import ThermalLock from './visors/components/ThermalLock.svelte';
	import ThermalCursor from './visors/components/ThermalCursor.svelte';
	import XrayCursor from './visors/components/XrayCursor.svelte';
	import HealthBar from './visors/components/HealthBar.svelte';
	import Selector from './visors/components/Selector.svelte';
	import DangerPing from './visors/components/DangerPing.svelte';
	import ScanVisor from './visors/ScanVisor.svelte';
	import ScanMarker from './visors/components/ScanMarker.svelte';
	import VisorSounds from './visors/components/VisorSounds.svelte';
	import ThermalSeeker from './visors/components/ThermalSeeker.svelte';
	import XraySeeker from './visors/components/XraySeeker.svelte';

	const maxRotateX = 1; // Degrees
	const maxRotateY = 1; // Degrees
	const maxSlideX = 1;
	const maxSlideY = 1;

	$: visorSlideX = -maxSlideX * $lookMovement.y;
	$: visorSlideY = maxSlideY * $lookMovement.x;

	$: visorRotateX = -maxRotateX * $lookMovement.y;
	$: visorRotateY = maxRotateY * $lookMovement.x;
</script>

<!-- STRUCTURE -->
<div id="visor">
	<!-- BASIC CURSOR -->
	<div id="cursor-layer">
		{#if $currentVisor === VisorType.Combat}
			<CombatCursor />
		{:else if $currentVisor === VisorType.Scan}
			<ScanCursor />
		{:else if $currentVisor === VisorType.Thermal}
			<CombatCursor />
			<ThermalCursor />
		{:else if $currentVisor === VisorType.Xray}
			<XrayCursor />
		{:else}
			<div>No Cursor Available</div>
		{/if}
	</div>
	<!-- SEEKER CURSOR -->
	<div id="seeker-layer">
		{#if $currentVisor === VisorType.Combat}
			<CombatSeeker />
		{:else if $currentVisor === VisorType.Scan}
			<ScanSeeker />
			<ScanMarker />
		{:else if $currentVisor === VisorType.Thermal}
			<ThermalSeeker />
		{:else if $currentVisor === VisorType.Xray}
			<XraySeeker />
		{:else}
			<div>No Cursor Available</div>
		{/if}
	</div>

	<!-- LOCK CURSOR -->
	<div id="lock-layer">
		{#if $currentVisor === VisorType.Combat}
			<CombatLock />
		{:else if $currentVisor === VisorType.Scan}
			<!--  -->
		{:else if $currentVisor === VisorType.Thermal}
			<ThermalLock />
		{:else if $currentVisor === VisorType.Xray}
			<!--  -->
		{:else}
			<div>No Cursor Available</div>
		{/if}
	</div>

	<div
		class="static-components"
		style="transform: rotateY({-visorRotateX}deg) 
			rotateX({visorRotateY}deg)
			translateX({visorSlideX}%)
			translateY({visorSlideY}%);
	"
	>
		<!-- VISOR LAYER -->
		<div id="visor-layer">
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

		<!-- CONTROLS LAYER -->
		<HealthBar />
		{#if !$isScanning}
			<Selector selectorType={SelectorType.Beam} />
			<Selector selectorType={SelectorType.Visor} />
		{/if}
		<!-- SOUNDS LAYER -->
		<DangerPing />
		<VisorSounds />

		<!-- HELMET -->
		<img src="Helmet 1x.png" id="helmet" alt="helmet" />
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
		perspective: 100vh;
		pointer-events: none;
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
		/* opacity: 40%; */
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

	/* .paused * {
		animation: none !important;
		transition: none !important;
		animation-play-state: paused !important;
	} */
</style>
