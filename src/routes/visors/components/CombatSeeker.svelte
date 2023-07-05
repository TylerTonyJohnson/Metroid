<script>
	import { isLockable, isLocked, closestSeekerPosition } from '../../../lib/stores';
	let x = 50;
	let y = 50;
</script>

{#if $isLockable}
        {@const x = (100 * ($closestSeekerPosition.x + 1)) / 2}
        {@const y = 100 * (1 - ($closestSeekerPosition.y + 1) / 2)}
		<img
			class="cursor rotate"
			src="Combat Seeker 1x.png"
			style="left: {x}%;
            top: {y}%;"
			class:locked={$isLocked}
			alt="Combat Seeker"
		/>
{/if}

<style>
	.cursor {
		position: absolute;
		height: calc((540%/1080)*100);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition-property: rotate;
		transition-duration: 0.5s;
		transition-timing-function: ease-out;
		/* transition: transform 2s ease-out; */
		rotate: 30deg;
	}

	.rotate {
		animation: spin 5s linear infinite forwards;
	}

	.locked {
		animation: none;

		rotate: 0deg;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
