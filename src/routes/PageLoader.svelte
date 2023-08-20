<script>
	import { fade, fly } from 'svelte/transition';
	import { appState, loadPercent } from '../lib/stores';
	import { AppState } from '../lib/enums';

	function start() {
		if ($appState === AppState.Ready) appState.set(AppState.Paused);
	}

	function keyDownHandler(event) {
		switch (event.code) {
			case 'Space':
			case 'Enter':
				start();
				break;
		}
	}

	const message = `This is a fan-made recreation of Metroid Prime: Remastered by Nintendo and Retro Studios. I do not own the original design work and it is only intended for education under "Fair Use" defined in Section 107 of the Copyright Act (1976)`;
</script>

<div id="frame" out:fade>
	<!-- Background -->

	<img class="background" src="Readout Center Background 1x.png" alt="background" />
	<div class="overlay">
		<!-- Message -->
		<img
			class="decoration"
			src="Readout Center Middle 1x.png"
			transition:fly={{ y: 100, duration: 250 }}
			alt="middle"
		/>
		<p class="message">{message}</p>
		<!-- Top Sandwich -->
		<img
			class="decoration"
			src="Readout Center Top 1x.png"
			transition:fly={{ y: -100, duration: 250 }}
			alt="top"
		/>
		<!-- Bottom Sandwich -->
		<img class="decoration" src="Readout Center Bottom 1x.png" alt="bottom" />

		<!-- Loading Bar -->
		{#if $appState === AppState.Loading}
			<div id="progress-container" out:fade>
				<div id="progress-sliver" style="width: {$loadPercent}%;" />
			</div>
		{/if}

		<!-- Button -->
		{#if $appState === AppState.Ready}
			<button class="button" type="button" on:click={start} in:fade>OK</button>
		{/if}
	</div>
</div>
<svelte:window on:keydown={keyDownHandler} />

<style>
	#frame {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920 / 1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.background {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		object-fit: cover;
	}

	.decoration {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		/* pointer-events: none; */
	}

	.message {
		position: absolute;
		height: calc(246% / 1080 * 100);
		aspect-ratio: 1110 / 246;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		padding: 0.5em;
		text-align: justify;
		font-family: 'Metroid';
		font-size: 3.5vh;
		color: #cae9fb;
		line-height: 1.15;
		letter-spacing: 0.05em;
	}

	.button {
		position: absolute;
		height: calc(46% / 1080 * 100);
		aspect-ratio: 1;
		left: 50%;
		top: calc(693% / 1080 * 100);
		translate: -50% 0;
		border-radius: 50%;
		border: solid #b8d3e0 0.3vh;
		background: none;
		text-align: center;
		vertical-align: middle;
		font-family: 'Metroid';
		font-size: 2vh;
		color: #cae9fb;
		pointer-events: all;
		padding: 1vh 0;
		animation: flash 1s linear infinite alternate;
	}

	.button:hover {
		filter: brightness(1.5);
		animation: none;
	}

	.overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 3em;
		padding: 3em;
		pointer-events: none;
	}

	#progress-container {
		position: absolute;
		left: 50%;
		top: 61.5%;
		translate: -50% -50%;
		display: flex;
		flex-direction: column;
		height: calc(10% / 1080 * 100);
		width: calc(610% / 1080 * 100);
	}

	#progress-sliver {
		height: 100%;
		width: 50%;
		left: 0;
		top: 0;
		background-color: #cae9fb;
	}

	@keyframes flash {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
