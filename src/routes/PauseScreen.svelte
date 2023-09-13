<script>
	import { fade } from 'svelte/transition';

	let credits = false;

	const creditData = [
		{ name: 'Rendering - three.js', source: 'https://threejs.org/' },
		{ name: 'Hud and structure - svelte', source: 'https://svelte.dev/' },
		{ name: 'Physics - cannon-es', source: 'https://pmndrs.github.io/cannon-es/' },
		{
			name: 'Metroid - ashquee',
			source: 'https://sketchfab.com/3d-models/metroid-6edbcaddb66f4e5c9c6efc2c3f02b4ea'
		},
		{
			name: 'Beta Metroid - Animattronic',
			source: 'https://sketchfab.com/3d-models/beta-metroid-6a1410bb0b1e41b3bbf7fa21781e35bc'
		},
		{
			name: 'Hangar - Lezalit',
			source: 'https://sketchfab.com/3d-models/sci-fi-hangar-4b263701219446f1ab13b37a5b98bac5'
		},
		{
			name: 'Arm Cannon - projectmgame',
			source: 'https://sketchfab.com/3d-models/light-suit-samus-84cea5887f374451ae2f090e6fea943d'
		}
	];

	function toggleCredits() {
		credits = !credits;
	}
</script>

<div id="frame" transition:fade={{ duration: 100 }}>
	<div class="controls-label">Controls</div>
	<img class="controls" src="Controls Diagram.png" alt="controls" />
	<div class="enter-text">
		<h1>Click anywhere to enter...</h1>
	</div>
	<div class="bottom-bar">
		<div class="link-container">
			<a
				class="link"
				href="https://github.com/TylerTonyJohnson/Metroid"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img class="link-image large" src="github-mark.svg" alt="github link" />
			</a>
			<a
				class="link"
				href="https://mail.google.com/mail/?view=cm&source=mailto&to=tyler.tony.johnson@gmail.com"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img class="link-image small" src="email-svgrepo-com.svg" alt="github link" />
			</a>
			<button type="button" class="link" on:click={toggleCredits}>
				<img class="link-image small" src="link.png" alt="github link" />
			</button>
		</div>
		{#if credits}
			<div class="credits-container" transition:fade>
				<h1 class="credit-label">CREDITS / RESOURCES</h1>
				{#each creditData as credit}
					<a class="credit" href={credit.source} target="_blank" rel="noopener noreferrer">
						<h1 class="credit-name">{credit.name}</h1>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	#frame {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: start;
		padding: 13vh 0vh;
		align-items: center;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.75);
		pointer-events: none;
	}

	.controls-label {
		text-align: center;
		color: #cae9fb;
		font-family: 'Metroid';
		font-size: 5vh;
		letter-spacing: 0.2em;
		padding: 4vh;
	}

	.controls {
		width: min(80vw, 100vh);
	}

	.enter-text {
		text-align: center;
		color: #cae9fb;
		font-family: 'Metroid';
		font-size: 1.5vh;
		letter-spacing: 0.2em;
		border: solid #cae9fb 2px;
		padding: 1.5vh 2vh 1vh 2vh;
		border-radius: 2vh;
		animation: flash 1s infinite linear alternate;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		display: grid;
		/* height: 20vh; */
		padding: 5vh 0vh;
		grid-template-areas: 'blank icons credits';
		grid-template-columns: 1fr auto 1fr;
		align-items: end;
		/* justify-content: end; */
		/* background-color: blue; */
	}

	.link-container {
		grid-area: icons;
		display: flex;
		margin: 0vh 5vh;
		/* background-color: green; */
	}

	.link {
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: all;
		margin: 1vh;
		width: 5vh;
		height: 5vh;
		border-radius: 50%;
		background-color: #fff;
		background-position: center;
		/* opacity: 0.9; */
		/* z-index: 999; */
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
		border: none;
	}

	.link:hover,
	.credit:hover {
		background-color: #33b2cc;
	}

	.small {
		height: 70%;
	}

	.large {
		height: 105%;
	}

	.credits-container {
		grid-area: credits;
		display: flex;
		flex-direction: column;
		justify-content: start;
		/* background-color: red; */
	}

	.credit-label {
		color: #cae9fb;
		font-family: 'Metroid';
		font-size: 2.5vh;
		letter-spacing: 0.2em;
	}

	.credit {
		pointer-events: all;
		display: flex;
		color: #cae9fb;
		padding: 0.5vh;
	}

	.credit-name {
		color: #cae9fb;
		font-family: 'Metroid';
		font-size: 2vh;
		letter-spacing: 0.2em;
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
