<script>
	import { AppState } from '../../../lib/enums';
	import { appState, isScanning, scanProgress } from '../../../lib/stores';
</script>

<div id="frame">
	<!-- Cursor -->
	<div id="cursor">
		<div class="buffer" />
		<svg id="focus" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				class="focus-path"
				class:scanning={$isScanning}
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M1080 0H0V1080H1080V0ZM769.106 769.101C895.635 642.571 895.635 437.425 769.106 310.895C642.576 184.366 437.43 184.366 310.9 310.895C184.371 437.425 184.371 642.571 310.9 769.101C437.43 895.63 642.576 895.63 769.106 769.101Z"
			/>
		</svg>
		<div class="buffer" />
	</div>
	<img id="aim-cursor" src="Scan Cursor Static 1x.png" alt="static" />
	<!-- Spinners -->
	<img
		class="spinner inner"
		class:paused={$appState !== AppState.Running}
		class:hide={$isScanning}
		src="Scan Cursor Spin Inner 1x.png"
		alt="inner"
	/>
	<img
		class="spinner outer"
		class:paused={$appState !== AppState.Running}
		class:hide={$isScanning}
		src="Scan Cursor Spin Outer 1x.png"
		alt="outer"
	/>
	<!-- Results box decoration -->
	<img
		id="result-box-decor"
		class:hide={!$isScanning}
		src="Scan Results Box 1x.png"
		alt="result-box-decor"
	/>
	<svg
		id="scan-progress"
		class:hide={!$isScanning}
		viewBox="0 0 520 388"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M72 370H448L460 382H60L72 370Z" fill="url(#scan-progress-gradient)" />
		<linearGradient id="scan-progress-gradient" x1="0" x2="100%" y1="0%" y2="0%">
			<stop offset="{$scanProgress}%" stop-color="#A3E7F5" />
			<stop offset="0%" stop-color="#5999A680" />
		</linearGradient>
	</svg>
</div>

<style>

	#frame {
		position: absolute;
		height: 100%;
		aspect-ratio: 1920 / 1080;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	#cursor {
		position: absolute;
		width: 100vw;
		height: 100vh;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		justify-content: center;
		align-items: center;
	}

	#focus {
		height: 100vh;
	}

	.focus-path {
		fill: black;
		fill-opacity: 0.5;
		transition: d 0.25s ease-out;
	}

	.buffer {
		background-color: rgba(0, 0, 0, 0.5);
		width: 100%;
		height: 100%;
	}

	#aim-cursor {
		position: absolute;
		height: calc(142% / 1080 * 100);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.spinner {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: all 0.25s ease-out;
	}

	.inner {
		height: calc(648% / 1080 * 100);
		animation: rotate 10s linear infinite;
	}

	.outer {
		height: calc(708% / 1080 * 100);
		animation: rotate 10s linear infinite reverse;
	}

	@keyframes rotate {
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
	}

	.paused {
		animation-play-state: paused;
	}

	.hide {
		opacity: 0;
		scale: 0 0;
	}

	.scanning {
		d: path(
			'M 1080 0 H 0 V 1080 H 1080 V 0 Z	M 800 734	C 800 734 800 346 800 346 	C 800 346 280 346 280 346 	C 280 346 280 734 280 734 	C 280 734 800 734 800 734 Z'
		);
	}

	#result-box-decor {
		position: absolute;
		height: calc(388% / 1080 * 100);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: all 0.15s ease-out;
	}

	#scan-progress {
		position: absolute;
		height: calc(388% / 1080 * 100);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		transition: all 0.15s ease-out;
	}
</style>
