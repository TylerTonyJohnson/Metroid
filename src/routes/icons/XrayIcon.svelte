<script>
	export let iconOffset;
	const xrayRadius = 40;
	const xrayDashLength = 30;
	const xrayAngle = Math.PI / 4;
	const xrayOffset = Math.PI / 2;
</script>

<svg class="icon-symbol-svg" viewBox="-2 -2 102 102" preserveAspectRatio="none"
    style='
        left: {50 + iconOffset.x}%;
        top: {50 + iconOffset.y}%;
        '>
    <circle
        class="icon-symbol"
        cx="{50}%"
        cy="{50}%"
        r="{xrayRadius}%"
    />
    {#each Array(4) as dash, i}
        <path
            class="icon-symbol-thick"
            d="
            M {50 + xrayRadius * Math.sin(xrayAngle / -2 + i * xrayOffset)} 
            {50 - xrayRadius * Math.cos(xrayAngle / -2 + i * xrayOffset)}
            A {xrayRadius} {xrayRadius} 0 0 1 
            {50 + xrayRadius * Math.sin(xrayAngle / 2 + i * xrayOffset)} 
            {50 - xrayRadius * Math.cos(xrayAngle / 2 + i * xrayOffset)}
        "
        />
    {/each}
    <path
        class="icon-symbol-thick"
        d="M {50 - xrayDashLength / 2} {50 - xrayDashLength / 2}
         l {xrayDashLength} {xrayDashLength}
         M {50 + xrayDashLength / 2} {50 - xrayDashLength / 2}
         l -{xrayDashLength} {xrayDashLength}
    "
    />
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