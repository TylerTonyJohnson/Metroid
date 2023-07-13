<script>
	import { scale } from 'svelte/transition';
	import { isLocked } from '../../../lib/stores';
</script>

{#if $isLocked}
		<img id='lock-cursor' src="Thermal Lock 1x.png" transition:scale={{start: 4}} alt="Thermal Lock" />
{/if}

<style>
	#lock-cursor {
		position: absolute;
        height: 55.55%;     /* This keeps it aligned by screen height */
		left: 50%;
		top: 52.96%;        /* This makes up for the thermal offset */
		translate: -50% -50%;
	}
</style>