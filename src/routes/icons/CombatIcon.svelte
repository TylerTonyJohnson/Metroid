<script>
	export let iconOffset;
	const radius = 30;
	const tightness = 3;
	const length = 33;
</script>

<svg class="icon-symbol-svg" viewBox="-2 -2 102 102" preserveAspectRatio="none"
    style='
        left: {50 + iconOffset.x}%;
        top: {50 + iconOffset.y}%;
        '>
	<circle
		class="icon-symbol-thick"
		cx="{50}%"
		cy="{50}%"
		r="{radius}%"
	/>
	<path
		class="icon-symbol-thick"
		d="M {50} {tightness} v {length}
			M {tightness} {50} h {length}
			M {100 - tightness} {50} h -{length}
			M {50} {100 - tightness} v -{length}"
	/>
</svg>

<style>
	.icon-symbol-svg {
		position: absolute;
		width: 65%;
		height: 65%;
        translate: -50% -50%;
	}

	.icon-symbol-thick {
		fill: none;
		stroke: white;
		stroke-width: 10;
	}
</style>
