<!-- LOGIC -->
<script>
	import { currentHealth, maxHealth } from '../lib/stores';
	import { tweened } from 'svelte/motion';

	$: remainderHealth = $currentHealth % 100;
</script>

<!-- STRUCTURE -->
<div id="health-display">
	<div class="health-num-container corners-and-borders">
		<div class="health-num left">{Math.floor(remainderHealth / 10)}</div>
		<div class="health-num right">{remainderHealth % 10}</div>
	</div>
	<div class="health-box-container corners">
		{#each Array(14) as box, i}
			<div
				class="health-box
                {(i + 1) * 100 <= $currentHealth ? 'full' : ''}
                {(i + 1) * 100 > $currentHealth && (i + 1) * 100 < $maxHealth ? 'empty' : ''}
                {(i + 1) * 100 >= $maxHealth ? 'missing' : ''}"
			/>
		{/each}
	</div>
	<div class="health-bar-container corners">
		<div class="health-bar">
			<div class="health-bar-filled" style="width: {(remainderHealth / 99) * 100}%" />
		</div>
	</div>
</div>

<!-- STYLE -->
<style>
	:root {
		--color-dim-blue: rgb(86, 118, 130);
		--color-alpha-blue: rgba(86, 118, 130, 0.3);
	}

	#health-display {
		position: absolute;
		display: grid;
		bottom: calc(50% + 300px);
		left: 50%;
		transform: translate(-50%, 0);
		grid-template-areas:
			'num box'
			'num bar';
		grid-template-rows: 22px 22px;
		grid-template-columns: 78px 272px;
		justify-content: center;
		align-items: center;
		font-family: 'vdl-gigajr', sans-serif;
		font-weight: 1000;
		font-style: normal;
		letter-spacing: -5px;
		/* background-color: orange; */
	}

	.health-num-container {
		grid-area: num;
		/* display: flex; */
		display: grid;
		grid-template-columns: auto auto;
		align-items: center;
		width: 100%;
		height: 100%;
		/* background-color: red; */
	}

	.health-num {
		/* display: flex; */
		/* position: relative; */
		font-size: 38px;
		line-height: 100%;
		/* padding-left: 10px; */
		/* padding-right: 10px; */
		color: hsl(192, 90%, 90%);
		text-shadow: 0 0 20px hsl(200, 80%, 80%), 0 0 5px hsl(200, 80%, 10%);
		/* background-color: orange; */
		width: 100%;
		/* right: 0; */
	}

	.health-num.left {
		padding-left: 8px;
	}

	.health-num.right {
		padding-right: 8px;
	}

	.health-box-container {
		grid-area: box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-left: 6px;
		padding-right: 6px;
	}

	.health-box {
		position: relative;
		height: 12px;
		width: 12px;
		border-radius: 30%;
	}

	.health-box.full {
		background-color: hsl(192, 90%, 80%);
		box-shadow: 0 0 3px hsl(200, 95%, 50%), inset 0 0 1px hsl(220, 100%, 20%);
	}

	.health-box.empty::before {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: 30%;
		border: solid 2px var(--color-dim-blue);
	}

	.health-box.missing::before {
		content: 'x';
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 20%;
		inset: 0;
		font-size: 6px;
		color: var(--color-dim-blue);
	}

	.health-bar-container {
		grid-area: bar;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.health-bar {
		position: relative;
		height: 10px;
		width: 92%;
		background-color: rgb(86, 118, 130);
		box-shadow: 0 0 3px rgb(86, 118, 130);
		border-radius: 2px;
	}

	.health-bar-filled {
		position: absolute;
		height: 100%;
		/* width: 75%; */
		background-color: hsl(192, 90%, 80%);
		box-shadow: 0 0 4px hsl(200, 95%, 50%), inset 0 0 2px hsl(220, 100%, 20%);
	}

	.corners {
		background: linear-gradient(to right, var(--color-dim-blue) 2px, transparent 2px) 0 0,
			linear-gradient(to right, var(--color-dim-blue) 2px, transparent 2px) 0 100%,
			linear-gradient(to left, var(--color-dim-blue) 2px, transparent 2px) 100% 0,
			linear-gradient(to left, var(--color-dim-blue) 2px, transparent 2px) 100% 100%,
			linear-gradient(to bottom, var(--color-dim-blue) 2px, transparent 2px) 0 0,
			linear-gradient(to bottom, var(--color-dim-blue) 2px, transparent 2px) 100% 0,
			linear-gradient(to top, var(--color-dim-blue) 2px, transparent 2px) 0 100%,
			linear-gradient(to top, var(--color-dim-blue) 2px, transparent 2px) 100% 100%;

		background-repeat: no-repeat;
		background-size: 4px 4px;
	}

	.corners-and-borders {
		background-image: linear-gradient(var(--color-alpha-blue) 33%, rgba(255, 255, 255, 0) 0%),
			linear-gradient(var(--color-alpha-blue) 30%, rgba(255, 255, 255, 0) 0%),
			linear-gradient(to right, var(--color-dim-blue) 2px, transparent 2px),
			linear-gradient(to right, var(--color-dim-blue) 2px, transparent 2px),
			linear-gradient(to left, var(--color-dim-blue) 2px, transparent 2px),
			linear-gradient(to left, var(--color-dim-blue) 2px, transparent 2px),
			linear-gradient(to bottom, var(--color-dim-blue) 2px, transparent 2px),
			linear-gradient(to bottom, var(--color-dim-blue) 2px, transparent 2px),
			linear-gradient(to top, var(--color-dim-blue) 2px, transparent 2px),
			linear-gradient(to top, var(--color-dim-blue) 2px, transparent 2px);
		background-position: left, right, left top, left bottom, right top, right bottom, left top,
			right top, left bottom, right bottom;
		background-size: 2px 4px, 2px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px,
			4px 4px;
		background-repeat: repeat-y, repeat-y, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat,
			no-repeat, no-repeat, no-repeat;
	}
</style>
