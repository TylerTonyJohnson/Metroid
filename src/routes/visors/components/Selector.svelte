<script>
	import { fade } from 'svelte/transition';
	import { BeamType, VisorType, SelectorType } from '../../../lib/enums';
	import { unlockedBeams, unlockedVisors, currentBeam, currentVisor } from '../../../lib/stores';

	export let selectorType;

	let message;
	let unlockedItems;

	$: switch (selectorType) {
		case SelectorType.Visor:
			unlockedItems = $unlockedVisors;
			switch ($currentVisor) {
				case VisorType.Combat:
					message = 'Combat Visor';
					break;
				case VisorType.Scan:
					message = 'Scan Visor';
					break;
				case VisorType.Thermal:
					message = 'Thermal Visor';
					break;
				case VisorType.Xray:
					message = 'X-ray Visor';
					break;
			}
			break;
		case SelectorType.Beam:
			unlockedItems = $unlockedBeams;
			switch ($currentBeam) {
				case BeamType.Power:
					message = 'Power Beam';
					break;
				case BeamType.Wave:
					message = 'Wave Beam';
					break;
				case BeamType.Ice:
					message = 'Ice Beam';
					break;
				case BeamType.Plasma:
					message = 'Plasma Beam';
					break;
			}
			break;
	}
</script>

<div id="frame">
	<div
		id="selector"
		class:left-screen={selectorType === SelectorType.Visor}
		class:right-screen={selectorType === SelectorType.Beam}
	>
		<!-- SELECTOR BACKGROUND -->
		<img class="background" src="Selector Slots 1x.png" alt="slots" />
		<img class="background" src="Selector Rings 1x.png" alt="rings" />

		<!-- SELECTOR TILES -->
		{#each unlockedItems as unlockedItem}
			<div
				class="tile"
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
				<!-- ICON IMAGE -->
				{#if unlockedItem === VisorType.Combat}
					<img class="tile-image" src="Combat Icon 1x.png" alt="combat icon" />
				{:else if unlockedItem === VisorType.Scan}
					<img class="tile-image" src="Scan Icon 1x.png" alt="scan icon" />
				{:else if unlockedItem === VisorType.Thermal}
					<img class="tile-image" src="Thermal Icon 1x.png" alt="thermal icon" />
				{:else if unlockedItem === VisorType.Xray}
					<img class="tile-image" src="Xray Icon 1x.png" alt="xray icon" />
				{:else if unlockedItem === BeamType.Power}
					<img class="tile-image" src="Power Icon 1x.png" alt="power icon" />
				{:else if unlockedItem === BeamType.Wave}
					<img class="tile-image" src="Wave Icon 1x.png" alt="wave icon" />
				{:else if unlockedItem === BeamType.Ice}
					<img class="tile-image" src="Ice Icon 1x.png" alt="ice icon" />
				{:else if unlockedItem === BeamType.Plasma}
					<img class="tile-image" src="Plasma Icon 1x.png" alt="plasma icon" />
				{/if}
			</div>
		{/each}

		{#key message}
			<div
				id="message"
				class:left-screen={selectorType === SelectorType.Visor}
				class:right-screen={selectorType === SelectorType.Beam}
			>
				{#each message.split('') as letter, i}
					<span in:fade={{ delay: i * 75 }}>{letter}</span>
				{/each}
			</div>
		{/key}
	</div>
</div>

<style>
	#frame {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920/1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		perspective: 100vh;
	}

	#selector {
		position: absolute;
		height: calc(240% / 1080 * 100);
		aspect-ratio: 1;
	}

	#selector.left-screen {
		left: calc(110% / 1920 * 100);
		bottom: 0%;
		transform: rotateY(35deg);
		transform-origin: left;
	}

	#selector.right-screen {
		right: calc(110% / 1920 * 100);
		bottom: 0%;
		transform: rotateY(-35deg);
		transform-origin: right;
	}

	.background {
		position: absolute;
		height: 100%;
	}

	.tile {
		position: absolute;
		aspect-ratio: 1;
		translate: -50% -50%;
		transition-property: width, height, left, top, filter;
		transition-duration: 0.2s;
		transition-timing-function: ease-in-out;
		transition-delay: 0s;
	}

	.tile.active {
		height: 32.5%;
		left: 50%;
		top: 50%;
		transition-delay: 0.1s;
		animation: activate 0.15s;
	}

	.tile:not(.active) {
		height: 21.67%;
		filter: brightness(0.5);
	}

	.tile.left:not(.active) {
		left: 17.5%;
	}
	.tile.center:not(.active) {
		left: 50%;
	}
	.tile.right:not(.active) {
		left: 82.5%;
	}
	.tile.top:not(.active) {
		top: 17.5%;
	}
	.tile.middle:not(.active) {
		top: 50%;
	}
	.tile.bot:not(.active) {
		top: 82.5%;
	}

	.tile-image {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	@keyframes activate {
		0% {
			filter: brightness(0.5);
		}
		33% {
			filter: brightness(1.25);
		}
		66% {
			filter: brightness(0.5);
		}
		100% {
			filter: brightness(1.25);
		}
	}

	#message {
		position: absolute;
		height: calc(110% / 240 * 100);
		width: calc(250% / 240 * 100);
		top: 53%;
		translate: 0 -50%;
		font-family: 'Metroid';
		font-size: 300%;
		color: #ccffff;
		-webkit-text-stroke: 2px hsl(200, 80%, 30%, 60%);
		animation: text-fade 3s forwards;
		animation-delay: 1s;
	}

	#message.left-screen {
		left: 100%;
		text-align: start;
	}

	#message.right-screen {
		right: 100%;
		text-align: end;
	}

	@keyframes text-fade {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
