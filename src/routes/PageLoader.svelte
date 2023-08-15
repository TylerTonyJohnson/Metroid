<script>
	import { fade } from 'svelte/transition';
	import { appState, loadPercent } from '../lib/stores';
	import { AppState } from '../lib/enums';

	function start() {
		appState.set(AppState.Running);
	}
</script>

<div id="frame" out:fade>
	<div id="disclaimer">
		<h1>Disclaimer</h1>
		<p>
			This is a fan-made recreation of the HUD from Metroid Prime: Remastered by Nintendo and Retro
			Studios. I do not own the original design work behind this project and it is intended for
			education and demonstration under "Fair Use" defined in Section 107 of the Copyright Act
			(1976)
		</p>
	</div>
	<div id="progress-container">
		<div id="progress-sliver" style="width: {$loadPercent}%;" />
		<div class="loading-text-container">
			{#if $appState === AppState.Loading}
				<div id="loading-text">Loading...</div>
			{/if}
		</div>
	</div>
	<div class="button-container">
		{#if $appState === AppState.Ready}
			<button id="ready-button" type="button" in:fade on:click={start}>READY</button>
		{/if}
	</div>
</div>

<style>
	#frame {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 3em;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 1);
		padding: 3em;
	}

	#progress-container {
		display: flex;
		flex-direction: column;
		height: 6vh;
		width: 50vw;
	}

	#progress-sliver {
		/* position: absolute; */
		height: 50%;
		width: 50%;
		left: 0;
		top: 0;
		background-color: blue;
	}

	.loading-text-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50%;
	}
	
	#loading-text {
		text-align: center;
		color: white;
		font-family: 'Metroid';
		animation: flash 1s infinite linear alternate;
	}

	.button-container {
		width: 200px;
		height: 100px;
	}

	#ready-button {
		height: 100%;
		width: 100%;
	}

	#disclaimer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		background-color: black;
		color: white;
		font-family: 'Metroid';
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
