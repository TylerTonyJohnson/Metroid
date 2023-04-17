<script>
	import { fade } from 'svelte/transition';
</script>

<div class="visor" transition:fade />

<style>
	.visor {
		position: absolute;
		inset: 0;
		font-family: 'vdl-gigajr', sans-serif;
		font-weight: 1000;
		font-style: normal;
		pointer-events: none;
		backdrop-filter: invert(1) saturate(0.3) sepia(0.5) hue-rotate(180deg) blur(1px);
		filter: blur(0);  /* Just for resize functionality */
	}
</style>
