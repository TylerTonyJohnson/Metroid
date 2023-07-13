<script>
	import { maxHealth, currentHealth } from '../../../lib/stores';

	$: maxBoxes = Math.floor($maxHealth / 100);
	$: currentBoxes = Math.floor($currentHealth / 100);
	$: remainderTens = Math.floor(($currentHealth % 100) / 10);
	$: remainderOnes = Math.floor($currentHealth % 10);
	$: barValue = (($currentHealth % 100) / 99) * 95;
</script>

<div id="health-display">
	<!-- BACKGROUND -->
	<img id="background" src="Health Display 1x.png" alt="Healthbar" />
	<!-- HEALTH NUMBERS -->
	<svg id="health-num-container" viewBox="0 0 65 41" fill="none" xmlns="http://www.w3.org/2000/svg">
		<text id="health-num" x="30%" y="62%">{remainderTens}</text>
		<text id="health-num" x="72%" y="62%">{remainderOnes}</text>
	</svg>
	<!-- HEALTH BOXES -->
	<div id="health-box-container">
		{#each Array(14) as box, index}
			<div class="health-box">
				<img class="health-box-x centered" src="Health X 1x.png" alt="x" />
				{#if (index + 1) <= currentBoxes}
					<img class="health-box-image centered" src="Health Box Full 1x.png" alt="empty" />
				{:else if (index + 1) <= maxBoxes}
					<img class="health-box-image centered" src="Health Box Empty 1x.png" alt="empty" />
				{/if}
			</div>
		{/each}
	</div>
	<!-- HEALTH BAR -->
	<div id='health-bar-container'>
		<svg id='health-bar' width="329" height="27" viewBox="0 0 329 27" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="2.5%" y="8" width="95%" height="10" rx="1" fill="#5999A6" fill-opacity="0.8" />
			<rect x="2.5%" y="8" width="{barValue}%" height="10" rx="1" fill="#A3E7F5" fill-opacity="0.9" stroke="#33B2CC"
				stroke-opacity="0.5" stroke-width="1.5" />
		</svg>
	</div>
</div>

<style>
	#health-display {
		display: grid;
		position: absolute;
		height: 5%;
		aspect-ratio: 418/54;
		left: 50%;
		top: 12.41%;
		translate: -50% 0%;
		grid-template-areas:
			'num box'
			'num bar';
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 90fr 328fr;
	}

	#background {
		position: absolute;
		height: 100%;
		left: 50%;
		translate: -50% 0%;
	}

	#health-num-container {
		grid-area: num;
		height: 100%;
		width: 100%;
		/* background-color: red; */
	}

	#health-num {
		font-family: 'Metroid';
		fill: #ccffff;
		stroke: hsl(200, 80%, 30%, 60%);
		stroke-width: 4;
		paint-order: stroke;
		font-size: 240%;
		dominant-baseline: central;
		text-anchor: middle;
	}

	#health-box-container {
		display: grid;
		grid-area: box;
		/* grid-auto-flow: column; */
		grid-template-columns: repeat(14, 1fr);
		justify-content: space-between;
		align-items: center;
		padding-left: 0.9%;
		padding-right: 0.9%;
		/* gap: 5px; */
		/* background-color: blue; */
	}

	.health-box {
		position: relative;
		width: 100%;
		height: 100%;
		/* border: solid red 1px; */
	}

	.centered {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.health-box-image {
		height: 53.85%;
		aspect-ratio: 1;
	}

	.health-box-x {
		height: 23.08%;
		aspect-ratio: 1;
	}

	#health-bar-container {
		position: relative;
		grid-area: bar;
		height: 100%;
		width: 100%;
		/* background-color: red; */
	}

	#health-bar {
		position: absolute;
		height: 100%;
		width: 100%;
	}
</style>
