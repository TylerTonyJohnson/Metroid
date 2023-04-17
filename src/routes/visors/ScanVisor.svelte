<!-- LOGIC -->
<script>
	import { fade } from 'svelte/transition';
	import { lookDistance } from '../../lib/stores';

	let pointerX = 50;
	let pointerY = 50;
	const cursorMax = 124;

	$: cursorLength =
		(1 - Math.min(Math.sqrt($lookDistance), 10) / 10) * (cursorMax / 2) + cursorMax / 2;
</script>

<!-- STRUCTURE -->

<div id="visor" transition:fade>
	<!-- OVERLAY -->
	<svg id="focus-overlay" width="100%" height="100%" preserveAspectRatio="none">
		<mask id="circle-mask">
			<rect width="100%" height="100%" fill="white" />
			<circle cx="50%" cy="50%" r="280" fill="black" />
		</mask>
		<rect width="100%" height="100%" id="full-visor" mask="url(#circle-mask)" />
	</svg>

	<div class="dot-grid-l" />
	<div class="dot-grid-r" />

	<div id="lens-line-inner" />
	<div id="lens-line-outer" />

	<!-- SIDE DECORATION -->

	{#if true}
	<div class="side-decor-container left">
		<div class="side-curve-container">
			<svg class="side-curve top" viewBox=" 0 0 100 100" preserveAspectRatio="none">
				<path class="side-curve-path" d="M 0 0 H 40 C 60 0 50 100 100 100" />
			</svg>
			<svg class="side-curve bot" viewBox=" 0 0 100 100" preserveAspectRatio="none">
				<path class="side-curve-path" d="M 0 0 H 40 C 60 0 50 100 100 100" />
			</svg>
		</div>
		<div class="side-altimeter-container">
			<div class="altimeter-small" />
			<div class="altimeter-large-container">
				<div class="altimeter-large-1" />
				<div class="altimeter-large-2" />
			</div>
			<svg class="altimeter-line top" viewbox="0 0 100 100">
				<path d="M 0 100 L 100 0" />
			</svg>
			<svg class="altimeter-line bot" viewbox="0 0 100 100">
				<path d="M 0 100 L 100 0" />
			</svg>
		</div>
		<div class="side-corner-container">
			<svg class="side-corner top" viewbox="-4 -4 104 104" preserveAspectRatio="none">
				<path class='side-corner-path' d="M 0 100 v -40 l 30 -60 H 100 l -33 33 h -25 l -20 40 v 25 Z" />
			</svg>
			<svg class="side-corner top front" viewbox="-4 -4 104 104" preserveAspectRatio="none">
				<path class='side-corner-path' d="M 0 100 v -40 l 30 -60 H 100 l -33 33 h -25 l -20 40 v 25 Z" />
			</svg>
			<svg class="side-corner bot" viewbox="-4 -4 104 104" preserveAspectRatio="none">
				<path class='side-corner-path' d="M 0 100 v -40 l 30 -60 H 100 l -33 33 h -25 l -20 40 v 25 Z" />
			</svg>
			<svg class="side-corner bot front" viewbox="-4 -4 104 104" preserveAspectRatio="none">
				<path class='side-corner-path' d="M 0 100 v -40 l 30 -60 H 100 l -33 33 h -25 l -20 40 v 25 Z" />
			</svg>
			<svg class="side-dagger top" viewBox="-2 -2 23 104" preserveAspectRatio="none">
				<path d="M 0 0 H 20 v 60 C 20 100 0 100 0 100 Z " />
			</svg>
			<svg class="side-dagger bot" viewBox="-2 -2 23 104" preserveAspectRatio="none">
				<path d="M 0 0 H 20 v 60 C 20 100 0 100 0 100 Z " />
			</svg>
			<div class="side-square" />
		</div>
	</div>
	<div class="side-decor-container right">
		<div class="side-curve-container">
			<svg class="side-curve top" viewBox=" 0 0 100 100" preserveAspectRatio="none">
				<path class="side-curve-path" d="M 0 0 H 40 C 60 0 50 100 100 100" />
			</svg>
			<svg class="side-curve bot" viewBox=" 0 0 100 100" preserveAspectRatio="none">
				<path class="side-curve-path" d="M 0 0 H 40 C 60 0 50 100 100 100" />
			</svg>
		</div>
		<div class="side-altimeter-container">
			<div class="altimeter-small" />
			<div class="altimeter-large-container">
				<div class="altimeter-large-1" />
				<div class="altimeter-large-2" />
			</div>
			<svg class="altimeter-line top" viewbox="0 0 100 100">
				<path d="M 0 100 L 100 0" />
			</svg>
			<svg class="altimeter-line bot" viewbox="0 0 100 100">
				<path d="M 0 100 L 100 0" />
			</svg>
		</div>
		<div class="side-corner-container">
			<svg class="side-corner top" viewbox="-4 -4 104 104" preserveAspectRatio="none">
				<path class='side-corner-path' d="M 0 100 v -40 l 30 -60 H 100 l -33 33 h -25 l -20 40 v 25 Z" />
			</svg>
			<svg class="side-corner top front" viewbox="-4 -4 104 104" preserveAspectRatio="none">
				<path class='side-corner-path' d="M 0 100 v -40 l 30 -60 H 100 l -33 33 h -25 l -20 40 v 25 Z" />
			</svg>
			<svg class="side-corner bot" viewbox="-4 -4 104 104" preserveAspectRatio="none">
				<path class='side-corner-path' d="M 0 100 v -40 l 30 -60 H 100 l -33 33 h -25 l -20 40 v 25 Z" />
			</svg>
			<svg class="side-corner bot front" viewbox="-4 -4 104 104" preserveAspectRatio="none">
				<path class='side-corner-path' d="M 0 100 v -40 l 30 -60 H 100 l -33 33 h -25 l -20 40 v 25 Z" />
			</svg>
			<svg class="side-dagger top" viewBox="-2 -2 23 104" preserveAspectRatio="none">
				<path d="M 0 0 H 20 v 60 C 20 100 0 100 0 100 Z " />
			</svg>
			<svg class="side-dagger bot" viewBox="-2 -2 23 104" preserveAspectRatio="none">
				<path d="M 0 0 H 20 v 60 C 20 100 0 100 0 100 Z " />
			</svg>
			<div class="side-square" />
		</div>
	</div>
	{/if}

	<!-- CURSOR -->
	<div
		id="cursor"
		style="
            left: {pointerX}%;
            top: {pointerY}%;
            width: {cursorLength}px;
            height: {cursorLength}px;
        "
	>
		<svg class="cursor-corner tl" viewBox="-4 -4 104 104">
			<defs>
				<filter id="f1" x="0" y="0">
				  <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
				</filter>
			  </defs>
			<path class="cursor-path" d="M 0,100 v -70 l 30,-30 h 70" />
		</svg>
		<svg class="cursor-corner tr" viewBox="-4 -4 104 104">
			<path class="cursor-path" d="M 0,100 v -60 l 40,-40 h 60" />
		</svg>
		<svg class="cursor-corner br" viewBox="-4 -4 104 104">
			<path class="cursor-path" d="M 0,100 v -60 l 40,-40 h 60" />
		</svg>
		<svg class="cursor-corner bl" viewBox="-4 -4 104 104">
			<path class="cursor-path" d="M 0,100 v -60 l 40,-40 h 60" />
		</svg>
		<svg class="cursor-dash l" viewBox="-4 -4 104 104">
			<path class="cursor-path-2" d="M 0 50 h 100" />
		</svg>
		<svg class="cursor-dash r" viewBox="-4 -4 104 104">
			<path class="cursor-path-2" d="M 0 50 h 100" />
		</svg>
	</div>
</div>

<!-- STYLE -->
<style>
	:root {
		--greenish: hsl(44, 17%, 46%, 0.5);
	}

	#visor {
		position: absolute;
		inset: 0;
		font-family: 'vdl-gigajr', sans-serif;
		font-weight: 1000;
		font-style: normal;
		pointer-events: none;
		perspective: 800px;
	}

	#full-visor {
		fill: rgba(0, 0, 0, 0.75);
	}

	/* OVERLAY */

	#focus-overlay {
		position: absolute;
		inset: 0;
		box-shadow: inset 0 0 1000px rgba(0, 0, 0, 0.75);
		-webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50%" cy="50%" r="257" /></svg>')
				0/100% 100%,
			linear-gradient(#fff, #fff);
		-webkit-mask-composite: destination-out;
	}

	.dot-grid-l {
		position: absolute;
		width: 50%;
		height: 66%;
		top: 0;
		right: 50%;
		background: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
		background-size: 60px 60px;
		/* background-color: red; */
		transform: rotateY(30deg);
		transform-origin: right;
		-webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><circle cx="100%" cy="75%" r="400" /></svg>')
				0/100% 100%,
			linear-gradient(#fff, #fff);
		-webkit-mask-composite: destination-out;
	}

	.dot-grid-r {
		position: absolute;
		width: 50%;
		height: 66%;
		top: 0;
		left: 50%;
		background: radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px);
		background-size: 60px 60px;
		/* background-color: green; */
		transform: rotateY(-30deg);
		transform-origin: left;
		-webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><circle cx="0%" cy="75%" r="400" /></svg>')
				0/100% 100%,
			linear-gradient(#fff, #fff);
		-webkit-mask-composite: destination-out;
	}

	/* ROTATING LINES */

	#lens-line-inner {
		--light-blue: rgba(0, 150, 250, 0.5);
		--light-teal: rgba(0, 200, 250, 0.5);

		position: absolute;
		height: 560px;
		width: 560px;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		border-radius: 50%;
		background: conic-gradient(
			var(--light-blue) 0 21deg,
			transparent 0 33deg,
			var(--light-blue) 0 39deg,
			transparent 0 51deg,
			var(--light-blue) 0 72deg,
			transparent 0 84deg,
			var(--light-blue) 0 90deg,
			transparent 0 102deg,
			var(--light-teal) 0 123deg,
			transparent 0 135deg,
			var(--light-teal) 0 141deg,
			transparent 0 153deg,
			var(--light-teal) 0 174deg,
			transparent 0 186deg,
			var(--light-blue) 0 194deg,
			transparent 0 206deg,
			var(--light-blue) 0 227deg,
			transparent 0 239deg,
			var(--light-blue) 0 245deg,
			transparent 0 257deg,
			var(--light-blue) 0 278deg,
			transparent 0 290deg,
			var(--light-teal) 0 296deg,
			transparent 0 308deg,
			var(--light-teal) 0 329deg,
			transparent 0 341deg,
			var(--light-teal) 0 347deg,
			transparent 0 360deg
		);
		-webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50%" cy="50%" r="277" /></svg>')
				0/100% 100%,
			linear-gradient(#fff, #fff);
		-webkit-mask-composite: destination-out;
		mask: url(#circle-mask);
		mask-composite: exclude;
		animation: lens-rotate 10s linear infinite;
	}

	#lens-line-outer {
		--light: hsl(200deg, 40%, 50%, 0.3);
		--medium: hsl(200deg, 40%, 75%, 0.4);
		--bright: hsl(200deg, 40%, 100%, 0.5);

		position: absolute;
		height: 615px;
		width: 615px;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		border-radius: 50%;
		background: conic-gradient(
			from -15deg,
			var(--light) 0 24deg,
			transparent 0 30deg,
			var(--medium) 0 31deg,
			transparent 0 45deg,
			var(--light) 0 45.5deg,
			transparent 0 47deg,
			var(--bright) 0 47.5deg,
			transparent 0 56deg,
			var(--medium) 0 57deg,
			transparent 0 72deg,
			var(--medium) 0 77deg,
			transparent 0 84deg,
			var(--bright) 0 84.5deg,
			transparent 0 97deg,
			var(--medium) 0 98deg,
			transparent 0 120deg,
			var(--bright) 0 120.5deg,
			transparent 0 124deg,
			var(--light) 0 124.5deg,
			transparent 0 136deg,
			var(--medium) 0 142deg,
			transparent 0 144deg,
			var(--light) 0 168deg,
			transparent 0 172deg,
			var(--medium) 0 173deg,
			transparent 0 177deg,
			var(--medium) 0 178deg,
			transparent 0 182deg,
			var(--medium) 0 187deg,
			transparent 0 195deg,
			var(--light) 0 195.5deg,
			transparent 0 210deg,
			var(--medium) 0 216deg,
			transparent 0 220deg,
			var(--medium) 0 221deg,
			transparent 0 228deg,
			var(--bright) 0 228.5deg,
			transparent 0 229.5deg,
			var(--bright) 0 230deg,
			transparent 0 260deg,
			var(--medium) 0 261deg,
			transparent 0 266deg,
			var(--light) 0 266.5deg,
			transparent 0 276deg,
			var(--medium) 0 282deg,
			transparent 0 290deg,
			var(--light) 0 290.5deg,
			transparent 0 291.5deg,
			var(--bright) 0 292deg,
			transparent 0 293deg,
			var(--light) 0 293.5deg,
			transparent 0 302deg,
			var(--light) 0 326deg,
			transparent 0 333deg,
			var(--medium) 0 339deg,
			transparent 0 360deg
		);
		-webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50%" cy="50%" r="300" /></svg>')
				0/100% 100%,
			linear-gradient(#fff, #fff);
		-webkit-mask-composite: destination-out;
		mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50%" cy="50%" r="275" /></svg>')
				0/100% 100%,
			linear-gradient(#fff, #fff);
		mask-composite: exclude;
		animation: lens-rotate 10s linear infinite reverse;
	}

	@keyframes lens-rotate {
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
	}

	/* SIDE DECORATION */

	.side-decor-container {
		position: absolute;
		display: flex;
		justify-content: end;
		align-items: center;
		width: 29%;
		height: 50%;
		top: 50%;
		translate: 0 -50%;
		transform: rotateY(30deg);
	}

	.side-decor-container.left {
		left: 0px;
	}
	.side-decor-container.right {
		right: 0px;
		scale: -1 1;
	}

	.side-curve-container {
		position: relative;
		/* background-color: red; */
		height: 110px;
		flex-grow: 1;
	}

	.side-curve {
		position: absolute;
		left: 0;
		height: 40%;
		width: 100%;
		mask-image: linear-gradient(white, black, white);
		-webkit-mask-image: linear-gradient( to right,
			rgba(0, 0, 0, 0.4) 20%,
			#ffffff 30%,
			#ffffff 70%,
			rgba(0, 0, 0, 0.4) 80%
		);
		-webkit-mask-size: 100% 100%;
	}

	.side-curve.top {
		top: 0;
	}
	.side-curve.bot {
		bottom: 0;
		scale: 1 -1;
	}

	.side-curve-path {
		vector-effect: non-scaling-stroke;
		fill: none;
		stroke: var(--greenish);
		stroke-width: 2;
	}

	.side-altimeter-container {
		position: relative;
		height: 100%;
		width: 50px;
		/* background-color: green; */
	}

	.altimeter-small {
		position: absolute;
		width: 6px;
		height: 40%;
		right: 2px;
		top: 50%;
		translate: 0 -50%;
		background: linear-gradient(transparent 2px, hsla(185, 17%, 55%, 0.25) 4px, transparent 6px);
		background-size: 100% 7.2px;
	}

	.altimeter-large-container {
		position: absolute;
		width: 10px;
		height: 60%;
		right: 20px;
		top: 50%;
		translate: 0 -50%;
		background: linear-gradient(transparent 2px, hsl(195, 17%, 55%, 0.25) 4px, transparent 6px);
		background-size: 100% 20px;
	}

	.altimeter-large-1 {
	}

	.altimeter-line {
		position: absolute;
		width: 50px;
		height: 50px;
		right: 4px;

		stroke: hsl(195, 17%, 55%, 0.25);
		stroke-width: 2;
	}

	.altimeter-line.top {
		top: 60px;
	}
	.altimeter-line.bot {
		bottom: 60px;
		scale: 1 -1;
	}

	.side-corner-container {
		position: relative;
		height: 100%;
		width: 86px;
		/* background-color: blue; */
		right: 0;
	}

	.side-corner {
		position: absolute;
		width: 80px;
		height: 55px;
	}

	.side-corner.top {
		top: 0;
		stroke: hsl(195, 17%, 55%, 1);
		stroke-width: 2;
		fill: hsl(195, 17%, 30%, 0.3);
	}
	.side-corner.bot {
		bottom: 0;
		scale: 1 -1;
		stroke: hsl(195, 17%, 55%, 1);
		stroke-width: 2;
		fill: hsl(195, 17%, 30%, 0.5);
	}
	.side-corner.top.front {
		translate: 8px -6px;
		stroke: hsl(195, 17%, 55%, 1);
		stroke-width: 2;
		fill: hsl(195, 17%, 46%, 0.5);
	}
	.side-corner.bot.front {
		translate: 8px 6px;
		stroke: hsl(195, 17%, 55%, 1);
		stroke-width: 2;
		fill: hsl(195, 17%, 46%, 0.5);
	}

	.side-corner-path {
		vector-effect: non-scaling-stroke;
	}

	.side-dagger {
		position: absolute;
		width: 18px;
		height: 106px;
		left: 5px;
		stroke: var(--greenish);
		stroke-width: 2;
		fill: none;
	}

	.side-dagger.top {
		top: 64px;
	}

	.side-dagger.bot {
		bottom: 64px;
		scale: 1 -1;
	}

	.side-square {
		position: absolute;
		width: 10px;
		height: 8px;
		left: 12px;
		top: 50%;
		translate: 0 -50%;
		background-color: hsl(195, 17%, 55%, 0.25);
	}

	/* CURSOR */

	#cursor {
		position: absolute;
		translate: -50% -50%;
		transition: all 0.075s linear;
	}

	.cursor-corner {
		position: absolute;
		width: 30%;
		height: 30%;
	}

	.cursor-corner.tl {
		left: 0;
		top: 0;
		rotate: 0;
	}
	.cursor-corner.tr {
		right: 0;
		top: 0;
		rotate: 90deg;
	}
	.cursor-corner.br {
		right: 0;
		bottom: 0;
		rotate: 180deg;
	}
	.cursor-corner.bl {
		left: 0;
		bottom: 0;
		rotate: 270deg;
	}

	.cursor-dash {
		position: absolute;
		width: 15%;
		height: 15%;
	}

	.cursor-dash.l {
		left: -15%;
		top: 50%;
		translate: 0% -50%;
	}

	.cursor-dash.r {
		right: -15%;
		top: 50%;
		translate: 0% -50%;
	}

	.cursor-path {
		stroke: hsl(200deg, 70%, 80%, 0.35);
		stroke-width: 2;
		fill: none;
		vector-effect: non-scaling-stroke;
	}

	.cursor-path-2 {
		stroke: hsl(200deg, 70%, 80%, 0.15);
		stroke-width: 2;
		fill: none;
		vector-effect: non-scaling-stroke;
	}

</style>
