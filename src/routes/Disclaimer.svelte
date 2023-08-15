<!-- <script>
	import { fade } from "svelte/transition";
    import { hasDisclaimed } from "../lib/stores";
</script>

<div id="disclaimer" transition:fade>
	<h1>Disclaimer</h1>
	<p>
		This is a fan-made recreation of the HUD from Metroid Prime: Remastered by Nintendo and Retro
		Studios. I do not own the original design work behind this project and it is intended for
		education and demonstration under "Fair Use" defined in Section 107 of the Copyright Act (1976)
	</p>
    <button on:click={() => hasDisclaimed.set(true)}>I Understand</button>
</div>

<style>
	#disclaimer {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		background-color: black;
		color: white;
		font-family: 'Metroid';
	}

</style> -->
