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

	const barRatio = 1 - 9 / 203;

	$: sliderX = -ammoPercent * barRatio;
	$: sliderY = ammoPercent;
</script>

<div id="frame">
	<div id="ammo-counter">
		<!-- BAR -->
		<svg id="bar" viewBox="0 0 203 336" xmlns="http://www.w3.org/2000/svg">
			<path d="M9 0H0L194 336H203L9 0Z" fill="url(#thermal-ammo-gradient)" />
			<linearGradient id="thermal-ammo-gradient" x1="0" x2="0" y1="100%" y2="0">
				<stop offset="{sliderY}%" stop-color="hsl(200, 100%, 85%, 80%)" />
				<stop offset="{0}%" stop-color="#80d4ff66" />
			</linearGradient>
		</svg>
		<!-- Slider -->
		<svg
			id="slider"
			style="bottom: {sliderY}%;
				left: {sliderX}%;"
			viewBox="0 0 220 138"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<!-- Line -->
			<path
				class="line"
				class:empty-stroke={status === AmmoState.Empty}
				class:some-stroke={status !== AmmoState.Empty}
				d="M120 84L206 84"
			/>
			<!-- Numbers -->
			<g
				class="numbers"
				class:empty-fill={status === AmmoState.Empty}
				class:some-fill={status !== AmmoState.Empty}
			>
				<text x="136" y="62">{currentAmmoHundreds}</text>
				<text x="164" y="62">{currentAmmoTens}</text>
				<text x="192" y="62">{currentAmmoOnes}</text>
				<text x="136" y="118">{maxAmmoHundreds}</text>
				<text x="164" y="118">{maxAmmoTens}</text>
				<text x="192" y="118">{maxAmmoOnes}</text>
			</g>

			<!-- Arrow -->
			<g
				class="arrow"
				class:empty-fill={status === AmmoState.Empty}
				class:some-fill={status !== AmmoState.Empty}
			>
				<path d="M29 77L33 84L26 102L45 105L49 112L18 107L29 77Z" />
				<path d="M37 90L34 97L41 98L37 90Z" />
			</g>
			<!-- Missile -->
			<g
				class="missile"
				class:empty-fill={status === AmmoState.Empty}
				class:some-fill={status !== AmmoState.Empty}
			>
				<path d="M84 56C79.0294 56 75 60.0294 75 65V74H93V65C93 60.0294 88.9706 56 84 56Z" />

				<path d="M76 77V91H92V77H76Z" />
				<path d="M63 105V110H71V97L63 105Z" />
				<path d="M105 105V110H97V97L105 105Z" />
				<path d="M74 94V110H82V98H86V110H94V94H74Z" />
			</g>
			<!-- Message -->
			<text
				class="message"
				class:warning-text={status === AmmoState.Low}
				class:empty-text={status === AmmoState.Empty}
				x="0"
				y="17">{message}</text
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
		width: calc(203% / 1920 * 100);
		height: calc(336% / 1080 * 100);
		right: calc(651% / 1920 * 100);
		top: calc(293% / 1080 * 100);
	}

	#bar {
		position: absolute;
		height: 100%;
		right: 0;
	}

	#slider {
		position: absolute;
		height: calc(138% / 336 * 100);
		translate: 90% 21%;
	}

	.message {
		font-family: 'Metroid';
		font-size: 200%;
		font-weight: 100;
		fill: #a3e7f5;
		stroke-width: 4;
		paint-order: stroke;
		dominant-baseline: central;
		text-anchor: start;
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

	.empty-fill {
		fill: hsl(190, 30%, 50%);
		fill-opacity: 50%;
	}

	.empty-stroke {
		stroke: hsl(190, 30%, 50%);
		stroke-opacity: 50%;
	}

	.some-fill {
		fill: hsl(190, 80%, 80%);
	}
	.some-stroke {
		stroke: hsl(190, 80%, 80%);
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
