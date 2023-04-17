<script>
	export let iconOffset;
	const scanWidth = 80;
	const scanHeight = 40;
	const scanCorner = 5;
	const scanOffset = {
		x: (100 - scanWidth) / 2,
		y: (100 - scanHeight) / 2
	};
	const scanThick = 10;
</script>

<svg
	class="icon-symbol-svg"
	viewBox="-2 -2 102 102"
	preserveAspectRatio="none"
	style="
        left: {50 + iconOffset.x}%;
        top: {50 + iconOffset.y}%;
        "
>
	<path
		class="icon-symbol"
		d="M {scanOffset.x + scanCorner} {scanOffset.y} 
        h {scanWidth - 2 * scanCorner} l {scanCorner} {scanCorner}  
        v {scanHeight - 2 * scanCorner} l -{scanCorner} {scanCorner}
        h -{scanWidth - 2 * scanCorner} l -{scanCorner} -{scanCorner}
        v -{scanHeight - 2 * scanCorner} z"
	/>
	<path
		class="icon-symbol-thick"
		d="M {scanOffset.x + scanCorner + scanThick} {scanOffset.y} 
        h -{scanThick} l -{scanCorner} {scanCorner}  
        v {scanHeight - 2 * scanCorner} l {scanCorner} {scanCorner} h {scanThick} 
        M {scanOffset.x + scanWidth - 2 * scanCorner} {scanOffset.y}
        h {scanThick} l {scanCorner} {scanCorner}  
        v {scanHeight - 2 * scanCorner} l -{scanCorner} {scanCorner} h -{scanThick}"
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
