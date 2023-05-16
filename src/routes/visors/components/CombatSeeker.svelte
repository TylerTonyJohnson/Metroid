<script>
	import { fade } from 'svelte/transition';
	import { isLockable, isLocked, seekerPosition } from '../../../lib/stores';
</script>

{#if $isLockable}
	<img id="cursor" src="Combat Seeker 1x.png" 
        transition:fade  
        style='left: {$seekerPosition.x}px;
            top: {$seekerPosition.y}px;'
        alt="Combat Seeker" />
        <div id='debug'         style='left: {$seekerPosition.x}px;
        top: {$seekerPosition.y}px;'></div>
{/if}

<style>
	#cursor {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: transform 2s ease-out;
        animation: spin 5s linear infinite forwards;
	}

    #debug {
        position: absolute;
        width: 6px;
        height: 6px;
        translate: -50% -50%;
        border-radius: 50%;
        background-color: blue;
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
