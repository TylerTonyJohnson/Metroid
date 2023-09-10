<script>
	import { fly, fade } from 'svelte/transition';

	export let message = 'Hi Matt, how is it going today, ready to play some League!';
</script>

<div id="frame" transition:fly={{ y: 200 }}>
	<div class="window-container">
		<div class="window-fuzz" style="background-image: url('Scan Result Window Seed 1x.png');" />
		<img class="window-frame-image" src="Scan Result Message 1x.png" alt="window" />
		<div x="5%" y="25%" class="message" >
			{#key message}
				{#each message.split('') as letter, i}
					<span in:fade={{ delay: 800 + i * 40, duration: 100 }}>{letter}</span>
				{/each}
			{/key}
		</div>
	</div>
</div>

<style>
	#frame {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920 / 1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		/* opacity: 1; */
	}

	.window-container {
		position: absolute;
		width: calc(680% / 1920 * 100);
		height: calc(318% / 1080 * 100);
		left: 50%;
		top: calc(748% / 1080 * 100);
		translate: -50% 0;
	}

	.window-frame-image {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.window-fuzz {
		position: absolute;
		height: calc(204% / 318 * 100);
		width: 97%;
		left: 50%;
		top: 3%;
		translate: -50% 0;
		background-size: contain;
		border-radius: 8%;
	}

	.message {
		position: absolute;
		padding: 0.8em;
		width: 100%;
		height: 100%;
		left: 0%;
		top: 0%;
		font-family: 'Metroid';
		/* font-size: 200%;*/
		/* font-size: calc(36vh/1080vh); */
		font-size: 3.5vh;
		font-weight: 100;
		/* color: #a3e7f5;*/
		color: #cae9fb;
		stroke-width: 4;
		paint-order: stroke;
        line-height: 1.1;
        letter-spacing: 0.05em;
		/* opacity: 1; */
		/* dominant-baseline: middle; */
		/* text-anchor: end; */
	}
</style>
