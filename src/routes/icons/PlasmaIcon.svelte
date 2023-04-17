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
	<path d="M25 59.8876L33.6891 43.1086L34.588 78.1648L25 59.8876Z" />
	<path d="M46.4232 10L48.0712 43.1086L39.5318 50.4494L40.8802 15.0936L46.4232 10Z" />
	<path d="M51.5169 10L53.4644 41.4607L74.588 55.6929L67.5468 27.9775L51.5169 10Z" />
	<path
		d="M50.3184 46.8539L38.4831 57.6404L39.5318 84.0075L46.4232 90L63.3521 87.4532L72.7903 62.2846L50.3184 46.8539Z"
	/>
</svg>

<style>
	.icon-symbol-svg {
		position: absolute;
		width: 65%;
		height: 65%;
		translate: -50% -50%;
	}

	path {
		fill: #ff4a49;
	}
</style>
