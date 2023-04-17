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
	<path d="M21.1135 54.8227L35.0142 61.7731V78.5106L17 58.3688L21.1135 54.8227Z" />
	<path d="M50.0497 10L49.0567 42.4823L39.8369 51.1348L44.9433 15.1064L50.0497 10Z" />
	<path d="M54.5887 10.8511V44.8936L64.5177 51.1348L58.9858 14.2553L54.5887 10.8511Z" />
	<path d="M74.305 47.0213L67.7802 53.5461L73.4539 57.5177L76.7163 49.1489L74.305 47.0213Z" />
	<path
		d="M50.0497 49.1489L38.844 59.3617L39.8369 84.3262L46.3617 90L62.3901 87.5887L71.3263 63.7589L50.0497 49.1489Z"
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
		fill: #ffb508;
	}
</style>
