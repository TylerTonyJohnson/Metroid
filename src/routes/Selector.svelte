<!-- LOGIC -->
<script>
	import { BeamType, SelectorType, VisorType } from '../lib/enums';
	import { currentVisor, unlockedVisors, currentBeam, unlockedBeams } from '../lib/stores';
	import CombatIcon from './icons/CombatIcon.svelte';
	import ScanIcon from './icons/ScanIcon.svelte';
	import ThermalIcon from './icons/ThermalIcon.svelte';
	import XrayIcon from './icons/XrayIcon.svelte';
	import PowerIcon from './icons/PowerIcon.svelte';
	import WaveIcon from './icons/WaveIcon.svelte';
	import IceIcon from './icons/IceIcon.svelte';
	import PlasmaIcon from './icons/PlasmaIcon.svelte';

	export let selectorType;

	// Generic Icon Parameters
	const iconCorner = 10;
	const iconInset = 10;
	const iconOffset = {
		x: selectorType === SelectorType.Visor ? 5 : -5,
		y: 5
	};
	const largeMaskLength = 38;
	const smallMaskLength = 20;

	let unlockedItems;
	switch (selectorType) {
		case SelectorType.Visor:
			unlockedItems = $unlockedVisors;
			break;
		case SelectorType.Beam:
			unlockedItems = $unlockedBeams;
			break;
		default:
			break;
	}
</script>

<!-- STRUCTURE -->
<div
	id="visor-selector"
	class:left-screen={selectorType === SelectorType.Visor}
	class:right-screen={selectorType === SelectorType.Beam}
>
	<!-- DECORATION -->
	{#if selectorType === SelectorType.Visor}
		<svg class="circle-svg" viewBox="0 0 100 100">
			<defs>
				<mask id="large-mask">
					<rect width="100%" height="100%" fill="white" />
					<polygon
						points="
                    {largeMaskLength},{0}
                    {100 - largeMaskLength},{0}
                    {100 - largeMaskLength},{largeMaskLength}
                    {100},{largeMaskLength}
                    {100},{100 - largeMaskLength}
                    {100 - largeMaskLength},{100 - largeMaskLength}
                    {100 - largeMaskLength},{100}
                    {largeMaskLength},{100}
                    {largeMaskLength},{100 - largeMaskLength}
                    {0},{100 - largeMaskLength}
                    {0},{largeMaskLength}
                    {largeMaskLength},{largeMaskLength} 
                    "
						fill="black"
					/>
				</mask>

				<mask id="small-mask">
					<rect width="100%" height="100%" fill="white" />
					<polygon
						points="
                    {smallMaskLength},{0}
                    {100 - smallMaskLength},{0}
                    {50},{50}
                    {100},{smallMaskLength}
                    {100},{100 - smallMaskLength}
                    {50},{50}
                    {100 - smallMaskLength},{100}
                    {smallMaskLength},{100}
                    {50},{50}
                    {0},{100 - smallMaskLength}
                    {0},{smallMaskLength}
                    {50},{50}"
						fill="black"
					/>
				</mask>
			</defs>
			<circle class="outer-circle" cx="50%" cy="50%" r="33%" mask="url(#large-mask)" />
			<circle class="inner-circle" cx="50%" cy="50%" r="23%" mask="url(#small-mask)" />
		</svg>
	{/if}

	<!-- SLOTS -->
	<div class="icon-slot top center" />
	<div class="icon-slot middle right" />
	<div class="icon-slot middle center" />
	<div class="icon-slot middle left" />
	<div class="icon-slot bot center" />

	<!-- ICONS -->
	{#each unlockedItems as unlockedItem}
		<div
			class="icon"
			class:left={unlockedItem === VisorType.Xray || unlockedItem === BeamType.Plasma}
			class:center={unlockedItem === VisorType.Combat ||
				unlockedItem === VisorType.Thermal ||
				unlockedItem === BeamType.Power ||
				unlockedItem === BeamType.Ice}
			class:right={unlockedItem === VisorType.Scan || unlockedItem === BeamType.Wave}
			class:top={unlockedItem === VisorType.Combat || unlockedItem === BeamType.Power}
			class:middle={unlockedItem === VisorType.Scan ||
				unlockedItem === VisorType.Xray ||
				unlockedItem === BeamType.Plasma ||
				unlockedItem === BeamType.Wave}
			class:bot={unlockedItem === VisorType.Thermal || unlockedItem === BeamType.Ice}
			class:active={$currentVisor === unlockedItem || $currentBeam === unlockedItem}
		>
			<!-- ICON SHAPE -->
			<svg class="icon-shape-svg" viewBox="-2 -2 102 102" preserveAspectRatio="none">
				<polygon
					class="icon-lines polygon"
					points="
                {iconCorner},{0} 
                {100 - iconCorner},{0}
                {100},{iconCorner}
                {100},{100 - iconCorner}
                {100 - iconCorner},{100}
                {iconCorner},{100}
                {0},{100 - iconCorner}
                {0},{iconCorner}"
				/>
				<polygon
					class="icon-lines polygon"
					points="
                {0 + iconCorner + iconInset + iconOffset.x},{0 + iconInset + iconOffset.y}  
                {100 - iconCorner - iconInset + iconOffset.x},{0 + iconInset + iconOffset.y}
                {100 - iconInset + iconOffset.x},{0 + iconCorner + iconInset + iconOffset.y}
                {100 - iconInset + iconOffset.x},{100 - iconCorner - iconInset + iconOffset.y}
                {100 - iconCorner - iconInset + iconOffset.x},{100 - iconInset + iconOffset.y}
                {0 + iconCorner + iconInset + iconOffset.x},{100 - iconInset + iconOffset.y}
                {0 + iconInset + iconOffset.x},{100 - iconCorner - iconInset + iconOffset.y}
                {0 + iconInset + iconOffset.x},{0 + iconCorner + iconInset + iconOffset.y}"
				/>
				<path
					class="icon-lines path"
					d="
                M {iconCorner} {0} l {iconInset + iconOffset.x} {iconInset + iconOffset.y}
                M {100 - iconCorner} {0} l -{iconInset - iconOffset.x} {iconInset + iconOffset.y}
                M {100} {iconCorner} l -{iconInset - iconOffset.x} {iconInset + iconOffset.y}
                M {100} {100 - iconCorner} l -{iconInset - iconOffset.x} -{iconInset - iconOffset.y}
                M {100 - iconCorner} {100} l -{iconInset - iconOffset.x} -{iconInset - iconOffset.y}
                M {iconCorner} {100} l {iconInset + iconOffset.x} -{iconInset - iconOffset.y}
                M {0} {100 - iconCorner} l {iconInset + iconOffset.x} -{iconInset - iconOffset.y}
                M {0} {iconCorner} l {iconInset + iconOffset.x} {iconInset + iconOffset.y}"
				/>
			</svg>
			<!-- ICON SYMBOL -->

			{#if unlockedItem === VisorType.Combat}
				<CombatIcon {iconOffset} />
			{:else if unlockedItem === VisorType.Scan}
				<ScanIcon {iconOffset} />
			{:else if unlockedItem === VisorType.Thermal}
				<ThermalIcon {iconOffset} />
			{:else if unlockedItem === VisorType.Xray}
				<XrayIcon {iconOffset} />
			{:else if unlockedItem === BeamType.Power}
				<PowerIcon {iconOffset} />
			{:else if unlockedItem === BeamType.Wave}
				<WaveIcon {iconOffset} />
			{:else if unlockedItem === BeamType.Ice}
				<IceIcon {iconOffset} />
			{:else if unlockedItem === BeamType.Plasma}
				<PlasmaIcon {iconOffset} />
			{/if}
		</div>
	{/each}
</div>

<!-- STYLE -->
<style>
	:root {
		--light: hsl(195, 50%, 50%, 1);
		--medium: hsl(195, 50%, 30%, 1);
		--dark: hsl(195, 25%, 20%, 1);
		--shadow: hsl(195, 25%, 5%, 1);
	}

	#visor-selector {
		perspective: 800px;
		position: absolute;
		width: 200px;
		height: 200px;
		bottom: 4px;
		/* scale: 1 1; */
	}

	.left-screen {
		right: calc(50% + 558px);
		transform: rotateY(35deg);
		transform-origin: left;
	}
	.right-screen {
		left: calc(50% + 558px);
		transform: rotateY(-35deg);
		transform-origin: right;
	}

	.icon-slot {
		position: absolute;
		width: 40px;
		height: 40px;
		background-color: var(--dark);
		translate: -50% -50%;
		border-radius: 20%;
		box-shadow: inset 0px 0px 16px black;
		border: solid 2px var(--shadow);
	}

	.circle-svg {
		width: 100%;
		height: 100%;
		/* background-color: red; */
	}

	.outer-circle {
		stroke: var(--dark);
		stroke-width: 2;
		fill: none;
		stroke-dasharray: 1 2;
	}

	.inner-circle {
		stroke: var(--light);
		stroke-width: 2;
		fill: none;
		/* stroke-dasharray: 25%; */
	}

	.icon {
		position: absolute;
		width: 42px;
		height: 42px;
		border-radius: 20%;
		translate: -50% -50%;
		transition-property: width, height, left, top;
		transition-duration: 0.2s;
		transition-timing-function: ease-in-out;
		transition-delay: 0s;
		display: grid;
		justify-content: center;
		align-items: center;
	}

	.left {
		left: 20%;
	}
	.center {
		left: 50%;
	}
	.right {
		left: 80%;
	}
	.top {
		top: 20%;
	}
	.middle {
		top: 50%;
	}
	.bot {
		top: 80%;
	}

	.icon-shape-svg {
		position: absolute;
		inset: 0;
		/* background-color: green; */
	}

	.icon-lines {
		stroke: var(--medium);
		stroke-width: 3;
	}

	.polygon {
		fill: var(--dark);
		transition: fill 0.2s ease-in-out, stroke 0.2s ease-in-out;
	}

	.path {
		fill: none;
		transition: stroke 0.2s ease-in-out;
	}

	.active {
		top: 50%;
		left: 50%;
		transition-delay: 0.1s;
		width: 60px;
		height: 60px;
	}

	.active polygon {
		fill: var(--medium);
	}

	.active .icon-lines {
		stroke: var(--light);
	}
</style>
