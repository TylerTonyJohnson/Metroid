<script>
	import { isLockable, isLocked, closestSeekerPosition } from '../../../lib/stores';
	let x = 50;
	let y = 50;
</script>

{#if isLockable}
	{@const x = (100 * ($closestSeekerPosition.x + 1)) / 2}
	{@const y = 100 * (1 - ($closestSeekerPosition.y + 1) / 2)}
	{@const dist = Math.sqrt(Math.pow(50 - x, 2) + Math.pow(50 - y, 2))}
	{#if dist < 30}
		<img
			id="cursor"
			src="Scan Seeker 1x.png"
			style="left: {x}%;
            top: {y}%;"
			alt="Combat Seeker"
		/>
	{/if}
{/if}

<style>
	#cursor {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: rotate 2s ease-out;
	}
</style>
