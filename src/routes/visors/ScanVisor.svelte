<script>
	import { fade, fly } from 'svelte/transition';
	import ScanDecor from './components/ScanDecor.svelte';
	import ScanAltimeters from './components/ScanAltimeters.svelte';
	import ScanWindow from './components/ScanWindow.svelte';
	import { scanProgress, closestSeekerType } from '../../lib/stores';
	import ScanMessage from './components/ScanMessage.svelte';
	import { scanData, ScanType } from '../../lib/experience/scanData';

	$: message = scanData.find((object) => object.type === $closestSeekerType)?.message;
	$: leftImage = scanData.find((object) => object.type === $closestSeekerType)?.left;
	$: rightImage = scanData.find((object) => object.type === $closestSeekerType)?.right;
</script>

<div id="frame" transition:fade={{ duration: '200' }}>
	<div id='visor'>
		<!-- DECORATION -->
		<ScanDecor />
		<!-- ALTIMETERS -->
		<ScanAltimeters />
	</div>
	<div id='results'>
		<!-- RESULTS -->
		{#if $scanProgress > 25 && leftImage}
			<ScanWindow side="left" imageUrl={leftImage} />
		{/if}
		{#if $scanProgress > 50 && rightImage}
			<ScanWindow side="right" imageUrl={rightImage} />
		{/if}
		{#if $scanProgress > 75}
			<ScanMessage {message} />
		{/if}
	</div>
</div>

<style>
	#frame {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	#visor {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		opacity: 50%;
	}

	#results {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;	
	}
</style>
