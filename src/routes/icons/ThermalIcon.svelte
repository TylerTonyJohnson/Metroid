<script>
	export let iconOffset;
	const thermalRadius = 38;
	const thermalAngle = Math.PI / 5;
	const thermalOffset = (2 * Math.PI) / 3;
	const thermalDash = 5;
</script>

<svg
	class="icon-symbol-svg"
	viewBox="-2 -2 102 102"
	preserveAspectRatio="none"
	style="
        left: {50 + iconOffset.x}%;
        top: {50 + iconOffset.y}%;"
>
	<path
		class="icon-symbol"
		d="
			M {50 + thermalRadius * Math.sin(thermalAngle / -2 + 0 * thermalOffset)} 
			{50 - thermalRadius * Math.cos(thermalAngle / -2 + 0 * thermalOffset)}
			L {50 + thermalRadius * Math.sin(thermalAngle / 2 + 0 * thermalOffset)} 
			{50 - thermalRadius * Math.cos(thermalAngle / 2 + 0 * thermalOffset)}
			L {50 + thermalRadius * Math.sin(thermalAngle / -2 + 1 * thermalOffset)} 
			{50 - thermalRadius * Math.cos(thermalAngle / -2 + 1 * thermalOffset)}
			L {50 + thermalRadius * Math.sin(thermalAngle / 2 + 1 * thermalOffset)} 
			{50 - thermalRadius * Math.cos(thermalAngle / 2 + 1 * thermalOffset)}
			L {50 + thermalRadius * Math.sin(thermalAngle / -2 + 2 * thermalOffset)} 
			{50 - thermalRadius * Math.cos(thermalAngle / -2 + 2 * thermalOffset)}
			L {50 + thermalRadius * Math.sin(thermalAngle / 2 + 2 * thermalOffset)} 
			{50 - thermalRadius * Math.cos(thermalAngle / 2 + 2 * thermalOffset)} Z"
	/>

	{#each Array(3) as _, i}
		{@const first = {
			x: 50 + thermalRadius * Math.sin(thermalAngle / -2 + i * thermalOffset),
			y: 50 - thermalRadius * Math.cos(thermalAngle / -2 + i * thermalOffset)
		}}
		{@const second = {
			x: 50 + thermalRadius * Math.sin(thermalAngle / 2 + i * thermalOffset),
			y: 50 - thermalRadius * Math.cos(thermalAngle / 2 + i * thermalOffset)
		}}
		{@const prev = {
			x: 50 + thermalRadius * Math.sin(thermalAngle / 2 + (i - 1) * thermalOffset),
			y: 50 - thermalRadius * Math.cos(thermalAngle / 2 + (i - 1) * thermalOffset)
		}}
		{@const next = {
			x: 50 + thermalRadius * Math.sin(thermalAngle / -2 + (i + 1) * thermalOffset),
			y: 50 - thermalRadius * Math.cos(thermalAngle / -2 + (i + 1) * thermalOffset)
		}}

		<path
			class="icon-symbol-thick"
			d="
				M {first.x + (prev.x - first.x) / thermalDash} {first.y + (prev.y - first.y) / thermalDash}	
				L {first.x} {first.y}
				L {second.x} {second.y}
				L {second.x + (next.x - second.x) / thermalDash} {second.y + (next.y - second.y) / thermalDash}"
		/>
	{/each}
</svg>

<style>
	.icon-symbol-svg {
		position: absolute;
		width: 65%;
		height: 65%;
		translate: -50% -50%;
	}

	.icon-symbol {
		fill: none;
		transition: fill 0.2s ease-in-out, stroke 0.2s ease-in-out;
		stroke: white;
		stroke-width: 3;
	}

	.icon-symbol-thick {
		fill: none;
		stroke: white;
		stroke-width: 10;
	}
</style>
