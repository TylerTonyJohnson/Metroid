<script>
	import { isLockable, isLocked, seekerPositions } from '../../../lib/stores';

	$: aspect = window.innerWidth / window.innerHeight;

	
</script>

{#if $isLockable}
	{#each $seekerPositions as seekerPosition}
		{@const x = (100 * (seekerPosition.x + 1)) / 2}
		{@const y = 100 * (1 - (seekerPosition.y + 1) / 2)}
		{@const xNorm = x}
		{@const dist = Math.sqrt( Math.pow((50  - xNorm), 2) + Math.pow((50  - y), 2))}
		{#if dist < 30}
			<img
				id="cursor"
				src="Scan Seeker Yellow 1x.png"
				style="left: {x}%; top: {y}%;"
				alt="Combat Seeker"
			/>
		{/if}
	{/each}
{/if}

<style>
	#cursor {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		width: 30px;
	}
</style>
