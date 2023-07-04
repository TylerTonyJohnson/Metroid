<script>
	import { currentDanger, thresholdDanger } from '../../../lib/stores';
</script>

<div id="frame">
	<div id="danger-counter">
		<!-- BAR -->
		<svg id="bar" viewBox="0 0 12 326" xmlns="http://www.w3.org/2000/svg">
			<rect width="12" height="326" rx="2" fill="#5999A6" fill-opacity="0.8"/>
			<rect
				x="1"
				y="{100 - $currentDanger}%"
				width="10"
				height="{$currentDanger}%"
				rx="1"
				fill="#A3E7F5"
				fill-opacity="0.9"
				stroke="#33B2CC"
				stroke-opacity="0.5"
				stroke-width="1.5"
			/>
		</svg>
		<svg
			id="arrow"
			viewBox="0 0 94 86"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style="
            bottom: {$currentDanger}%;
            "
		>
			<path
				d="M12.5 33V36.843L4.81 43L12.5 49.156V53L0 43L12.5 33Z"
				fill="#5999A6"
				fill-opacity="0.8"
			/>
			<path d="M12.5 40.686L9.61 43L12.5 45.314V40.686Z" fill="#5999A6" fill-opacity="0.8" />
			<path
				d="M62 65L71 59.75V25.25L62 20M50 20L41 25.25V59.75L50 65"
				id="buffer"
				class:low-danger={$currentDanger < $thresholdDanger}
				stroke-width="3"
			/>
			<path
				d="M21 78L28 85H84L91 78M21 8L28 1H84L91 8M93.5 77C93.5 77.8284 92.8284 78.5 92 78.5C91.1716 78.5 90.5 77.8284 90.5 77C90.5 76.1716 91.1716 75.5 92 75.5C92.8284 75.5 93.5 76.1716 93.5 77ZM93.5 9C93.5 9.82843 92.8284 10.5 92 10.5C91.1716 10.5 90.5 9.82843 90.5 9C90.5 8.17157 91.1716 7.5 92 7.5C92.8284 7.5 93.5 8.17157 93.5 9ZM21.5 77C21.5 77.8284 20.8284 78.5 20 78.5C19.1716 78.5 18.5 77.8284 18.5 77C18.5 76.1716 19.1716 75.5 20 75.5C20.8284 75.5 21.5 76.1716 21.5 77ZM21.5 9C21.5 9.82843 20.8284 10.5 20 10.5C19.1716 10.5 18.5 9.82843 18.5 9C18.5 8.17157 19.1716 7.5 20 7.5C20.8284 7.5 21.5 8.17157 21.5 9Z"
				stroke="#5999A6"
				stroke-opacity="0.8"
			/>
			<text id="exclamation" x="56" y="44" class:low-danger={$currentDanger < $thresholdDanger}>
				!
			</text>
		</svg>
	</div>
</div>

<style>
	#frame {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920/1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	#danger-counter {
		position: absolute;
		width: 6.15%;
		height: 30.19%;
		left: 10.6%;
		top: 35%;
		perspective: 50vh;
	}

	#bar {
		position: absolute;
		height: 100%;
		left: 0;
		top: 0;
	}

	#arrow {
		position: absolute;
		height: 25.77%;
		right: 0;
		translate: 0 50%;
		transform: rotateY(15deg);
		transform-origin: left;
	}

	#exclamation {
		font-family: 'Metroid';
		fill: #a3e7f5;
		stroke-width: 4;
		paint-order: stroke;
		font-size: 200%;
		dominant-baseline: central;
		text-anchor: middle;
	}

	#buffer {
		stroke: #a3e7f5;
	}

	#exclamation.low-danger,
	#buffer.low-danger {
		filter: opacity(0.5);
	}
</style>
