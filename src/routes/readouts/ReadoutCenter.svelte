<script>
	import { fly, fade } from 'svelte/transition';

	export let message;
	export let callback;

</script>

<div id="frame" transition:fade={{ duration: 250 }}>
	<!-- Message -->
	<img
		class="decoration"
		src="Readout Center Middle 1x.png"
		transition:fly={{ y: 100, duration: 250 }}
		alt="middle"
	/>
	<p class='message'>{message}</p>
	<!-- Top Sandwich -->
	<img
		class="decoration"
		src="Readout Center Top 1x.png"
		transition:fly={{ y: -100, duration: 250 }}
		alt="top"
	/>
	<!-- Bottom Sandwich -->
	<img class="decoration" src="Readout Center Bottom 1x.png" alt="bottom" />
	<!-- <button class='button' type='button' on:click={callback}>␣</button> -->
	<button class='button' type='button' on:click={callback}>OK</button>
</div>

<style>
	#frame {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920 / 1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		pointer-events: none;
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
		/* font-size: 200%; */
		font-size: 3.5vh;
		color: #CAE9FB;
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
		border: solid #B8D3E0 0.3vh;
		/* background: red; */
		background: none;
		text-align: center;
		vertical-align: middle;
		font-family: 'Metroid';
		font-size: 2vh;
		color: #CAE9FB;
		pointer-events: all;
        /* line-height: 1; */
		/* margin: auto; */
		padding: 1vh 0;
        /* letter-spacing: 0.05em; */
	}

	.button:hover {
		filter: brightness(1.5);
	}
</style>
