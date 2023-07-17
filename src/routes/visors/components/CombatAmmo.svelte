<script>
	import { currentAmmo, maxAmmo } from '../../../lib/stores';
	import { AmmoState } from '../../../lib/enums';

	$: ammoPercent = ($currentAmmo / $maxAmmo) * 100;

	$: currentAmmoHundreds = Math.floor(($currentAmmo / 100) % 10);
	$: currentAmmoTens = Math.floor(($currentAmmo / 10) % 10);
	$: currentAmmoOnes = Math.floor(($currentAmmo / 1) % 10);
	$: maxAmmoHundreds = Math.floor(($maxAmmo / 100) % 10);
	$: maxAmmoTens = Math.floor(($maxAmmo / 10) % 10);
	$: maxAmmoOnes = Math.floor(($maxAmmo / 1) % 10);

	const lowAmmoThresh = 20; // Percent

	let status;
	let message;

	$: switch (true) {
		case ammoPercent === 100:
			status = AmmoState.Full;
			message = '';
			break;
		case ammoPercent > lowAmmoThresh:
			status = AmmoState.High;
			message = '';
			break;
		case ammoPercent > 0:
			status = AmmoState.Low;
			message = 'Missiles Low';
			break;
		case ammoPercent === 0:
			status = AmmoState.Empty;
			message = 'Depleted';
			break;
	}
</script>

<div id="frame">
	<div id="ammo-counter">
		<!-- BAR -->
		<svg id="bar" viewBox="0 0 12 326" xmlns="http://www.w3.org/2000/svg">
			<rect width="12" height="326" rx="2" fill="url(#combat-ammo-gradient)" />
			<linearGradient id="combat-ammo-gradient" x1="0" x2="0" y1="100%" y2="0%">
				<stop offset="{ammoPercent}%" stop-color="#A3E7F5" />
				<stop offset="0%" stop-color="#5999A680" />
			</linearGradient>
		</svg>
		<!-- Slider -->
		<svg
			class="slider"
			style="bottom: {ammoPercent}%;"
			viewBox="0 0 333 140"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<!-- Line -->
			<path
				class="line"
				class:empty-stroke={status === AmmoState.Empty}
				class:some-stroke={status !== AmmoState.Empty}
				d="M135 86L221 86"
			/>
			<g
				class="numbers"
				class:empty-fill={status === AmmoState.Empty}
				class:some-fill={status !== AmmoState.Empty}
			>
				<!-- Numbers -->
				<text x="148" y="65">{currentAmmoHundreds}</text>
				<text x="177" y="65">{currentAmmoTens}</text>
				<text x="206" y="65">{currentAmmoOnes}</text>
				<text x="148" y="118">{maxAmmoHundreds}</text>
				<text x="177" y="118">{maxAmmoTens}</text>
				<text x="206" y="118">{maxAmmoOnes}</text>
			</g>
			<!-- Arrow -->
			<path
				class="arrow"
				class:empty-fill={status === AmmoState.Empty}
				class:some-fill={status !== AmmoState.Empty}
				d="M320.5 76V79.843L328.19 86L320.5 92.156V96L333 86L320.5 76Z"
			/>
			<path
				class="arrow"
				class:empty-fill={status === AmmoState.Empty}
				class:some-fill={status !== AmmoState.Empty}
				d="M320.5 83.686L323.39 86L320.5 88.314V83.686Z"
			/>
			<!-- Box -->
			<path
				class="box"
				class:empty-stroke={status === AmmoState.Empty}
				class:some-stroke={status !== AmmoState.Empty}
				d="M242 121L249 128H305L312 121M242 51L249 44H305L312 51M314.5 120C314.5 120.828 313.828 121.5 313 121.5C312.172 121.5 311.5 120.828 311.5 120C311.5 119.172 312.172 118.5 313 118.5C313.828 118.5 314.5 119.172 314.5 120ZM314.5 52C314.5 52.8284 313.828 53.5 313 53.5C312.172 53.5 311.5 52.8284 311.5 52C311.5 51.1716 312.172 50.5 313 50.5C313.828 50.5 314.5 51.1716 314.5 52ZM242.5 120C242.5 120.828 241.828 121.5 241 121.5C240.172 121.5 239.5 120.828 239.5 120C239.5 119.172 240.172 118.5 241 118.5C241.828 118.5 242.5 119.172 242.5 120ZM242.5 52C242.5 52.8284 241.828 53.5 241 53.5C240.172 53.5 239.5 52.8284 239.5 52C239.5 51.1716 240.172 50.5 241 50.5C241.828 50.5 242.5 51.1716 242.5 52Z"
			/>
			<!-- Missile -->
			<g
				class="missile"
				class:empty-fill={status === AmmoState.Empty}
				class:some-fill={status !== AmmoState.Empty}
			>
				<path d="M277 59C272.029 59 268 63.0294 268 68V77H286V68C286 63.0294 281.971 59 277 59Z" />
				<path d="M269 80V94H285V80H269Z" />
				<path d="M256 108V113H264V100L256 108Z" />
				<path d="M298 108V113H290V100L298 108Z" />
				<path d="M267 97V113H275V101H279V113H287V97H267Z" />
			</g>
			<!-- Message -->
			<text
				class="message"
				class:warning-text={status === AmmoState.Low}
				class:empty-text={status === AmmoState.Empty}
				x="222"
				y="18">{message}</text
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

	#ammo-counter {
		position: absolute;
		width: calc(12% / 1920 * 100);
		height: calc(326% / 1080 * 100);
		right: calc(207% / 1920 * 100);
		top: calc(380% / 1080 * 100);
		perspective: 50vh;
	}

	#bar {
		position: absolute;
		height: 100%;
		right: 0;
		top: 0;
	}

	.slider {
		position: absolute;
		height: calc(140% / 326 * 100);
		right: 200%;
		translate: 0 38%;
		transform: rotateY(-15deg);
		transform-origin: right;
		scale: 1.1 1;
	}

	.arrow,
	.missile,
	.numbers {
		fill-opacity: 90%;
	}

	.box {
		fill-opacity: 60%;
	}

	.empty-fill {
		fill: hsl(190, 30%, 50%);
		fill-opacity: 50%;
	}

	.empty-stroke {
		stroke: hsl(190, 30%, 50%);
	}

	.some-fill {
		fill: hsl(190, 80%, 80%);
	}

	.some-stroke {
		stroke: hsl(190, 80%, 80%);
	}

	.line {
		stroke-width: 3;
	}

	.numbers {
		font-family: 'Metroid';
		fill: #a3e7f5;
		paint-order: stroke;
		font-weight: 100;
		font-size: 270%;
		dominant-baseline: central;
		text-anchor: middle;
	}

	.message {
		font-family: 'Metroid';
		font-size: 200%;
		font-weight: 100;
		fill: #a3e7f5;
		stroke-width: 4;
		paint-order: stroke;
		dominant-baseline: central;
		text-anchor: end;
	}

	.warning-text {
		fill: #e5c31a;
		stroke: #998000;
		animation: low-ammo-flash 0.5s linear 5 forwards;
	}

	.empty-text {
		fill: #e5631a;
		stroke: #993300;
		animation: empty-flash 0.5s linear 5 forwards;
	}

	@keyframes low-ammo-flash {
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

	@keyframes empty-flash {
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
