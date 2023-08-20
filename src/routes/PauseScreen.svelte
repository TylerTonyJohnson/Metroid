<script>
	import { fade } from "svelte/transition";


</script>

<div id='frame' transition:fade={{duration: 100}}>
    <div class='controls-label'>Controls</div>
    <img class='controls' src='Controls Diagram.png' alt='controls'/>
    <div class='enter-text'>
        <h1>Click to enter...</h1>
    </div>
</div>

<style>
    #frame {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.75);
        pointer-events: none;
    }

    .controls-label {
        text-align: center;
		color: #cae9fb;
		font-family: 'Metroid';
        font-size: 2em;
        letter-spacing: 0.2em;
    }

    .controls {
        width: min(80vw, 100vh);
    }

    .enter-text {
        text-align: center;
		color: #cae9fb;
		font-family: 'Metroid';
        font-size: 0.75em;
        letter-spacing: 0.2em;
		animation: flash 1s infinite linear alternate;
    }

    @keyframes flash {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>