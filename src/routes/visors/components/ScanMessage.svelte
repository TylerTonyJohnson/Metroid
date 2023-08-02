<script>
	import { fly, fade } from 'svelte/transition';

	let message = 'Hi Matt, how is it going today, ready to play some League!';
</script>

<div id="frame" transition:fly={{ y: 200 }}>
	<div class="window-container">
		<div class="window-fuzz" />
		<img class="window-frame-image" src="Scan Result Message 1x.png" alt="window" />
		<div x="5%" y="25%" class="message" >
			{#key message}
				{#each message.split('') as letter, i}
					<span in:fade={{ delay: 1000 + i * 50, duration: 100 }}>{letter}</span>
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
		background-image: url('Scan Result Window Seed 1x.png');
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
		font-size: 200%;
		font-weight: 100;
		color: #a3e7f5;
		stroke-width: 4;
		paint-order: stroke;
        line-height: 1.1;
        letter-spacing: 0.05em;
		/* dominant-baseline: middle; */
		/* text-anchor: end; */
	}
</style>
