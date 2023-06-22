<script>
	import { isLockable, isLocked, closestSeekerPosition } from '../../../lib/stores';
	let x = 50;
	let y = 50;
</script>

{#if $isLockable}
        {@const x = (100 * ($closestSeekerPosition.x + 1)) / 2}
        {@const y = 100 * (1 - ($closestSeekerPosition.y + 1) / 2)}
		<img
			id="cursor"
			src="Combat Seeker 1x.png"
			style="left: {x}%;
            top: {y}%;"
			alt="Combat Seeker"
		/>
{/if}

<style>
	#cursor {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: rotate 2s ease-out;
		animation: spin 5s linear infinite both;
	}

	@keyframes spin {
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
	}
</style>
