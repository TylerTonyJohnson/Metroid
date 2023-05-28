<script>
	import { fade } from 'svelte/transition';
	import {
		isLockable,
		isLocked,
		seekerPixelX,
		seekerPixelY,
		seekerPositions
	} from '../../../lib/stores';

	$: seekerPercentX = (100 * ($seekerPositions[0].x + 1)) / 2;
	$: seekerPercentY = 100 * (1 - ($seekerPositions[0].y + 1) / 2);
</script>

{#if $isLockable}
	{#each $seekerPositions as seekerPosition}
        {@const x = (100 * (seekerPosition.x + 1)) / 2}
        {@const y = 100 * (1 - (seekerPosition.y + 1) / 2)}
		<img
			id="cursor"
			src="Scan Seeker Yellow 1x.png"
			style="left: {x}%;
            top: {y}%;"
			alt="Combat Seeker"
		/>
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
