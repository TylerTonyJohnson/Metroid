<script>
    import { fade } from 'svelte/transition';
	import { lookDistance } from '../../lib/stores';

	let pointerX = 50;
	let pointerY = 50;

	let rayDistance;
	lookDistance.subscribe((value) => {
		rayDistance = value;
	});

	const cursorDiam = 100;
	const cursorMax = 30;

	$: cursorLength =
		(1 - Math.min(Math.sqrt(rayDistance), 10) / 10) * (cursorMax / 2) + cursorMax / 2;
</script>

<div id="visor" transition:fade>

	<!-- CURSOR -->
	<div
		id="cursor"
		style="
            left: {pointerX}%;
            top: {pointerY}%;
            width: {cursorDiam}px;
            height: {cursorDiam}px;
        "
	>
		{#each Array(3) as _}
			<div id="dash-line" style="height: {cursorLength}px" />
		{/each}
		<div id="inner-circle" />
		<div id="outer-circle" />
	</div>
</div>

<style>
	#visor {
		position: absolute;
		inset: 0;
		font-family: 'vdl-gigajr', sans-serif;
		font-weight: 1000;
		font-style: normal;
		/* pointer-events: none; */
		background-image: url('CombatDecor.svg');
		background-size: auto 100%;
		background-position: center;
		background-repeat: no-repeat;
	}

	#cursor {
		position: absolute;
		border-radius: 50%;
		overflow: hidden;
		translate: -50% -50%;
	}

	#inner-circle {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		width: 10px;
		height: 10px;
		background-color: blue;
		border-radius: 50%;
	}

	#dash-line {
		position: absolute;
		width: 6px;
		height: 30px;
		left: 50%;
		top: 0%;
		translate: -50% 0;
		background-color: blue;
		transform-origin: 3px 50px;
	}

	#dash-line:nth-child(1) {
		rotate: 0deg;
	}

	#dash-line:nth-child(2) {
		rotate: 120deg;
	}

	#dash-line:nth-child(3) {
		rotate: 240deg;
	}

</style>
