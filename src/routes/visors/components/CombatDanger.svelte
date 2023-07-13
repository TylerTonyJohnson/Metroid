<script>
	import { currentDanger, thresholdDanger } from '../../../lib/stores';
	import { DangerType } from '../../../lib/enums';

	let status;
	let message;

	$: {
		switch (true) {
			case $currentDanger === 100:
				status = DangerType.Damage;
				message = 'Danger';
				break;
			case $currentDanger > $thresholdDanger:
				status = DangerType.Warning;
				message = 'Warning';
				break;
			case $currentDanger > 0:
				status = DangerType.Sensing;
				message = '';
				break;
			case $currentDanger === 0:
				status = DangerType.None;
				message = '';
				break;
		}
	}
</script>

<div id="frame">
	<div id="danger-counter">
		<!-- BAR -->
		<svg id="bar" viewBox="0 0 12 326" xmlns="http://www.w3.org/2000/svg">
			<rect width="12" height="326" rx="2" fill="#5999A6" fill-opacity="0.8" />
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

		<!-- Slider -->
		<svg
			class="slider"
			style="bottom: {$currentDanger}%;"
			viewBox="0 0 252 86"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<!-- Arrow -->
			<path
				class="arrow base-fill"
				class:sensing={status === DangerType.Sensing || status === DangerType.Warning}
				class:damage-fill={status === DangerType.Damage}
				d="M12.5 33V36.843L4.81 43L12.5 49.156V53L0 43L12.5 33Z"
			/>
			<path
				class="arrow base-fill"
				class:sensing={status === DangerType.Sensing || status === DangerType.Warning}
				class:damage-fill={status === DangerType.Damage}
				d="M12.5 40.686L9.61 43L12.5 45.314V40.686Z"
			/>

			<!-- Buffers -->
			<path
				class="buffer base-fill"
				class:sensing={status === DangerType.Sensing || status === DangerType.Warning}
				class:damage-fill={status === DangerType.Damage}
				d="M62 20V16L74 24V60L62 68V64L71 58V26L62 20Z"
			/>
			<path
				class="buffer base-fill"
				class:sensing={status === DangerType.Sensing || status === DangerType.Warning}
				class:damage-fill={status === DangerType.Damage}
				d="M50 20V16L38 24V60L50 68V64L41 58V26L50 20Z"
			/>

			<!-- Box -->
			<path
				class="box base-stroke"
				class:damage-stroke={status === DangerType.Damage}
				d="M21 78L28 85H84L91 78M21 8L28 1H84L91 8M93.5 77C93.5 77.8284 92.8284 78.5 92 78.5C91.1716 78.5 90.5 77.8284 90.5 77C90.5 76.1716 91.1716 75.5 92 75.5C92.8284 75.5 93.5 76.1716 93.5 77ZM93.5 9C93.5 9.82843 92.8284 10.5 92 10.5C91.1716 10.5 90.5 9.82843 90.5 9C90.5 8.17157 91.1716 7.5 92 7.5C92.8284 7.5 93.5 8.17157 93.5 9ZM21.5 77C21.5 77.8284 20.8284 78.5 20 78.5C19.1716 78.5 18.5 77.8284 18.5 77C18.5 76.1716 19.1716 75.5 20 75.5C20.8284 75.5 21.5 76.1716 21.5 77ZM21.5 9C21.5 9.82843 20.8284 10.5 20 10.5C19.1716 10.5 18.5 9.82843 18.5 9C18.5 8.17157 19.1716 7.5 20 7.5C20.8284 7.5 21.5 8.17157 21.5 9Z"
			/>

			<!-- Framers -->
			<path
				class="framer base-stroke"
				class:damage-stroke={status === DangerType.Damage}
				d="M69 17L77 22V31M43 17L35 22V31M69 67L77 62V53M43 67L35 62V53"
			/>

			<!-- Exclamation -->
			<text
				class="exclamation base-fill"
				class:sensing={status === DangerType.Sensing || status === DangerType.Warning}
				class:damage-fill={status === DangerType.Damage}
				x="56"
				y="48">!</text
			>
		</svg>

		<!-- Message -->
		<svg
			class="slider"
			style="bottom: {$currentDanger}%;"
			viewBox="0 0 252 86"
			xmlns="http://www.w3.org/2000/svg"
		>
			<text
				class="message"
				class:warning-text={status === DangerType.Warning}
				class:damage-text={status === DangerType.Damage}
				x="165"
				y="45"
				fill="white">{message}</text
			>
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
		width: calc(12% / 1920 * 100);
		height: calc(326% / 1080 * 100);
		left: calc(207% / 1920 * 100);
		top: calc(380% / 1080 * 100);
		perspective: 50vh;
	}

	#bar {
		position: absolute;
		height: 100%;
		left: 0;
		top: 0;
	}

	.slider {
		position: absolute;
		height: 25.77%;
		left: 200%;
		translate: 0 50%;
		transform: rotateY(15deg);
		transform-origin: left;
		scale: 1.1 1;
	}

	.exclamation {
		font-family: 'Metroid';
		stroke-width: 4;
		font-size: 280%;
		dominant-baseline: central;
		text-anchor: middle;
	}

	.message {
		font-family: 'Metroid';
		fill: #a3e7f5;
		stroke-width: 4;
		paint-order: stroke;
		font-size: 200%;
		dominant-baseline: central;
		text-anchor: middle;
	}

	.arrow,
	.buffer,
	.exclamation {
		fill-opacity: 90%;
	}

	.box {
		fill-opacity: 60%;
	}

	.framer {
		stroke-opacity: 30%;
	}

	.base-stroke {
		stroke: hsl(190, 30%, 50%);
	}

	.base-fill {
		fill: hsl(190, 30%, 50%);
	}

	.sensing {
		fill: hsl(190, 80%, 80%);
	}

	.warning-text {
		fill: #e5c31a;
		stroke: #998000;
		animation: flashing-text 0.5s linear infinite;
	}

	.damage-fill {
		animation: damage-fill 0.5s linear forwards;
	}

	.damage-stroke {
		animation: damage-stroke 0.5s linear forwards;
	}

	.damage-text {
		fill: #e5631a;
		stroke: #993300;
		animation: flashing-text 0.5s linear infinite;
	}

	@keyframes damage-fill {
		50% {
			fill: hsl(10, 80%, 50%);
		}
		100% {
			fill: hsl(35, 80%, 50%);
		}
	}

	@keyframes damage-stroke {
		50% {
			stroke: hsl(10, 80%, 50%);
		}
		100% {
			stroke: hsl(35, 80%, 50%);
		}
	}

	@keyframes flashing-text {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
