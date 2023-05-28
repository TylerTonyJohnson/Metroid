<script>
	import { isLockable, isLocked, seekerPixelX, seekerPixelY } from '../../../lib/stores';
</script>

{#if $isLockable}
	<img
		id="cursor"
		src="Combat Seeker 1x.png"
		style="left: {$seekerPixelX}px;
            top: {$seekerPixelY}px;"
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
