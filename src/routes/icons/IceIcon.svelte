<script>
	export let iconOffset;
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
	<path d="M 26 66 L 34 56 V 77 L 26 66 Z" />
	<path d="M 43 10 L 47 42 L 39 49 L 38 14 L 43 10 Z" />
	<path d="M 68 28 L 67 52 L 73 56 L 72 27 L 68 28 Z" />
	<path d="M 50 46 L 38 57 L 39 84 L 46 90 L 63 87 L 72 62 L 50 46 Z" />
</svg>

<style>
	.icon-symbol-svg {
		position: absolute;
		width: 65%;
		height: 65%;
		translate: -50% -50%;
	}

	path {
		fill: #5ae7f8;
	}
</style>
