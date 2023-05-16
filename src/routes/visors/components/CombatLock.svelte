<script>
	import { fade, scale } from 'svelte/transition';
	import { isLocked } from '../../../lib/stores';
</script>

{#if $isLocked}
	<div id="cursor" transition:fade>
		<img src="Combat Lock Inner 1x.png" transition:scale alt="Combat Lock" />
		<img src="Combat Lock Outer 1x.png" alt="Combat Lock" />
		<img class="spin" src="Combat Lock Lines 1x.png" alt="Combat Lock" />
	</div>
{/if}

<style>
	#cursor, #cursor > * {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.spin {
		animation: spin 5s linear infinite;
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
