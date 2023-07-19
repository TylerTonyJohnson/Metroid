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

	const barRatio = 1 - 9 / 203;

	$: sliderX = $currentDanger * barRatio;
	$: sliderY = $currentDanger;
</script>

<div id="frame">
	<div id="danger-counter">
		<!-- BAR -->
		<svg id="bar" viewBox="0 0 203 336" xmlns="http://www.w3.org/2000/svg">
			<path d="M194 0H203L9 336H0L194 0Z" fill="url(#danger-gradient)" />
			<linearGradient id="danger-gradient" x1="0" x2="0" y1="100%" y2="0">
				<stop offset="{sliderY}%" stop-color="hsl(200, 100%, 85%, 80%)" />
				<stop offset="{0}%" stop-color="#80d4ff66" />
			</linearGradient>
		</svg>

		<!-- Slider -->
		<svg
			class="slider"
			style="bottom: {sliderY}%;
				left: {sliderX}%;"
			viewBox="0 0 266 66"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<!-- Arrow -->
			<path
				class="arrow base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				d="M255 31L251 38L258 56L239 59L235 66L266 61L255 31Z"
			/>
			<path
				class="arrow base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				d="M247 44L250 51L243 52L247 44Z"
			/>
			<!-- Buffers -->
			<path
				class="buffer base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				d="M208 4V0L220 8V44L208 52V48L217 42V10L208 4Z"
			/>
			<path
				class="buffer base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				d="M196 4V0L184 8V44L196 52V48L187 42V10L196 4Z"
			/>
			<!-- Framers -->
			<path
				class="framer base-stroke"
				class:damage-stroke={status === DangerState.Damage}
				d="M215 1L223 6V15M189 1L181 6V15M215 51L223 46V37M189 51L181 46V37"
			/>
			<!-- Exclamation -->
			<text
				class="exclamation base-fill"
				class:sensing={status === DangerState.Sensing || status === DangerState.Warning}
				class:damage-fill={status === DangerState.Damage}
				x="202"
				y="32">!</text
			>
			<!-- Message -->
			<text
				class="message"
				class:warning-text={status === DangerState.Warning}
				class:damage-text={status === DangerState.Damage}
				x="86"
				y="28"
				fill="white">{message}</text
			>
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
		width: calc(203% / 1920 * 100);
		height: calc(336% / 1080 * 100);
		left: calc(651% / 1920 * 100);
		top: calc(293% / 1080 * 100);
	}

	#bar {
		position: absolute;
		height: 100%;
		left: 0;
	}

	.slider {
		position: absolute;
		height: calc(66% / 336 * 100);
		translate: -105% 5%;
	}

	.arrow,
	.buffer,
	.exclamation {
		fill-opacity: 90%;
	}

	.framer {
		stroke-opacity: 30%;
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
