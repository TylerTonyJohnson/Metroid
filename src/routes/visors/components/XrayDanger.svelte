<!-- LOGIC -->
<script>
	import { currentDanger, thresholdDanger } from '../../../lib/stores';
	import { DangerState } from '../../../lib/enums';

	let status;
	let message;

	$: {
		switch (true) {
			case $currentDanger === 100:
				status = DangerState.Damage;
				message = 'Danger';
				break;
			case $currentDanger > $thresholdDanger:
				status = DangerState.Warning;
				message = 'Warning';
				break;
			case $currentDanger > 0:
				status = DangerState.Sensing;
				message = '';
				break;
			case $currentDanger === 0:
				status = DangerState.None;
				message = '';
				break;
		}
	}

	const dangerBarDegrees = 64;

	$: dangerRotation = ($currentDanger / 100 - 1 / 2) * dangerBarDegrees;
</script>

<div id="frame">
	<div id="danger-counter">
		<!-- Bar -->
		<svg id="bar" viewBox="0 0 88 450" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M10.0049 225C10.0049 303.751 32.4119 380.876 74.6088 447.368L83.0533 442.009C41.8734 377.12 20.0064 301.853 20.0064 225C20.0064 148.147 41.8734 72.8799 83.0534 7.99066L74.6088 2.63159C32.4119 69.1233 10.0049 146.249 10.0049 225Z"
				fill="url(#danger-gradient)"
			/>
			<linearGradient id="danger-gradient" x1="0%" x2="0%" y1="100%" y2="0%">
				<stop offset="{$currentDanger}%" stop-color="#A3E7F5" />
				<stop offset="0%" stop-color="#5999A680" />
			</linearGradient>
		</svg>
		<!-- Exclamation -->
		<svg id="exclamation" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
			<!-- Buffers -->
			<path
				class="buffer base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				d="M28.0049 3.99951V-0.000488281L40.0049 7.99951V43.9995L28.0049 51.9995V47.9995L37.0049 41.9995V9.99951L28.0049 3.99951Z"
			/>
			<path
				class="buffer base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				d="M16.0049 3.99951V-0.000488281L4.00488 7.99951V43.9995L16.0049 51.9995V47.9995L7.00488 41.9995V9.99951L16.0049 3.99951Z"
			/>
			<!-- Framers -->
			<path
				class="framer base-stroke"
				class:damage-stroke={status === DangerState.Damage}
				d="M35.0049 0.999512L43.0049 5.99951V14.9995M9.00488 0.999512L1.00488 5.99951V14.9995M35.0049 50.9995L43.0049 45.9995V36.9995M9.00488 50.9995L1.00488 45.9995V36.9995"
			/>
			<!-- Exclamation -->
			<text
				class="exclamation-text base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				x="50%"
				y="62%">!</text
			>
		</svg>
		<!-- Slider -->
		<svg
			id="slider"
			viewBox="0 0 1080 1080"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style="rotate: {dangerRotation}deg"
		>
			<!-- Arrow -->
			<path
				class="arrow base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				d="M90 520V527.686L105.38 540L90 552.312V560L115 540L90 520Z"
			/>
			<path
				class="arrow base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				d="M90 535.372L95.78 540L90 544.628V535.372Z"
			/>

			<!-- Message -->
			<defs>
				<path id="text-path-danger" d="M155.448,720.956C128.811,664.35 115,602.561 115,540" />
			</defs>
			<text>
				<textPath
					id="message"
					class:warning-text={status === DangerState.Warning}
					class:damage-text={status === DangerState.Damage}
					href="#text-path-danger"
					startOffset="80%">
					{message}
				</textPath
				>
			</text>
		</svg>
	</div>
</div>

<!-- STYLE -->
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
		width: calc(1080% / 1920 * 100);
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	#bar {
		position: absolute;
		height: calc(450% / 1080 * 100);
		left: calc(115% / 1080 * 100);
		top: calc(315% / 1080 * 100);
	}

	#exclamation {
		position: absolute;
		height: calc(52% / 1080 * 100);
		left: calc(31% / 1080 * 100);
		top: 50%;
		translate: 0 -50%;
	}

	#slider {
		position: absolute;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.arrow,
	.buffer {
		fill-opacity: 90%;
	}

	.framer {
		stroke-opacity: 30%;
	}

	.exclamation-text {
		font-family: 'Metroid';
		stroke-width: 4;
		font-size: 280%;
		dominant-baseline: central;
		text-anchor: middle;
	}

	#message {
		font-family: 'Metroid';
		stroke-width: 4;
		paint-order: stroke;
		font-size: 200%;
		/* dominant-baseline: central; */
		text-anchor: end;
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
