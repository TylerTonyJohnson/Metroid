<script>
	import { fade, scale } from 'svelte/transition';
	import { isLocked } from '../../../lib/stores';
</script>

{#if $isLocked}
	<div id="cursor" transition:fade>
		<img class='inner' src="Combat Lock Inner 1x.png" transition:scale={{start: 0}} alt="Combat Lock" />
		<img class='outer' src="Combat Lock Outer 1x.png" transition:scale={{start: 4}} alt="Combat Lock" />
		<img class="spin" src="Combat Lock Lines 1x.png" alt="Combat Lock" />
	</div>
{/if}

<style>
	#cursor {
		position: absolute;
		height: calc(558%/1080*100);
		aspect-ratio: 1;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.inner, .outer, .spin {
		position: absolute;
		height: 100%;
		width: 100%;
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
