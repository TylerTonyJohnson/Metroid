<!-- LOGIC -->
<script>
	import { isZoomed, lookMovement } from '../../../lib/stores';

	const minWidth = 532;
	const maxWidth = 548;
	const minHeight = 494;
	const maxHeight = 510;

	const maxOffsetX = 1;
	const maxOffsetY = 1;

	$: offsetX = $isZoomed ? 50 : 50 + maxOffsetX * $lookMovement.x;
	$: offsetY = $isZoomed ? 50 : 50 + maxOffsetY * $lookMovement.y;

	const smallZoom = 6;
	const spreadOffset = 15;

	$: zoomOffsetBotX = $isZoomed ? 0 : 0;
	$: zoomOffsetBotY = $isZoomed ? smallZoom : 0;
	$: zoomOffsetLeftX = $isZoomed ? smallZoom * Math.cos((210 * Math.PI) / 180) : 0;
	$: zoomOffsetLeftY = $isZoomed ? smallZoom * Math.sin((210 * Math.PI) / 180) : 0;
	$: zoomOffsetRightX = $isZoomed ? smallZoom * Math.cos((330 * Math.PI) / 180) : 0;
	$: zoomOffsetRightY = $isZoomed ? smallZoom * Math.sin((330 * Math.PI) / 180) : 0;

	$: spreadBotX = $isZoomed ? spreadOffset : 0;
	$: spreadBotY = $isZoomed ? 0 : 0;
	$: spreadLeftX = $isZoomed ? spreadOffset * Math.cos((300 * Math.PI) / 180) : 0;
	$: spreadLeftY = $isZoomed ? spreadOffset * Math.sin((300 * Math.PI) / 180) : 0;
	$: spreadRightX = $isZoomed ? spreadOffset * Math.cos((60 * Math.PI) / 180) : 0;
	$: spreadRightY = $isZoomed ? spreadOffset * Math.sin((60 * Math.PI) / 180) : 0;
</script>

<div
	id="cursor"
	style="
		left: {offsetX}%;
		top: {offsetY}%;
		width: {0}px;
		height: {0}px;
	}"
>
	<!-- BUFFER BARS -->
	<svg
		class="buffer"
		width="184"
		height="20"
		viewBox="0 0 184 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="
			left: calc(174px - {minWidth / 2}px + {zoomOffsetBotX}px);
			top: calc(474px - {minHeight / 2}px + {zoomOffsetBotY}px);"
	>
		<path
			class="cursor-path"
			d="M24 0L30.8284 6.82843C31.5786 7.57857 32.596 8 33.6569 8H150.343C151.404 8 152.421 7.57857 153.172 6.82843L160 0H184L172 20H143.414C142.509 20 141.64 19.6403 141 19V19C140.36 18.3597 139.491 18 138.586 18H45.4142C44.5087 18 43.6403 18.3597 43 19V19C42.3597 19.6403 41.4913 20 40.5858 20H12L0 0H24Z"
		/>
	</svg>
	<svg
		class="buffer"
		width="104"
		height="159"
		viewBox="0 0 104 159"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="
			left: calc(39px - {minWidth / 2}px + {zoomOffsetLeftX}px);
			top: calc(101px - {minHeight / 2}px + {zoomOffsetLeftY}px);"
	>
		<path
			d="M92 20L82.5892 22.5666C81.5712 22.8442 80.7042 23.5128 80.1769 24.4268L21.8328 125.556C21.2998 126.48 21.1579 127.579 21.4385 128.608L24 138L12 159L0 139L14.241 114.316C14.73 113.468 15.5126 112.829 16.4409 112.52L16.5502 112.483C17.4838 112.172 18.27 111.528 18.7582 110.673L65.5059 28.8646C65.8297 28.298 66 27.6567 66 27.0041V27.0041C66 26.3463 66.1731 25.7 66.5018 25.1302L80.9998 0H104L92 20Z"
		/>
	</svg>
	<svg
		class="buffer"
		width="104"
		height="159"
		viewBox="0 0 104 159"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="
			left: calc(389px - {minWidth / 2}px + {zoomOffsetRightX}px);
			top: calc(101px - {minHeight / 2}px + {zoomOffsetRightY}px);"
	>
		<path
			class="cursor-path"
			d="M12 20L21.4108 22.5666C22.4288 22.8442 23.2958 23.5128 23.8231 24.4268L82.1672 125.556C82.7002 126.48 82.8421 127.579 82.5615 128.608L80 138L92 159L104 139L89.759 114.316C89.27 113.468 88.4874 112.829 87.5591 112.52L87.4498 112.483C86.5162 112.172 85.73 111.528 85.2418 110.673L38.4941 28.8646C38.1703 28.298 38 27.6567 38 27.0041V27.0041C38 26.3463 37.8269 25.7 37.4982 25.1302L23.0002 0H0.000198364L12 20Z"
		/>
	</svg>

	<!-- TRIANGLES -->
	<svg
		class="cursor"
		width="209"
		height="64"
		viewBox="0 0 209 64"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="
		left: calc(50px - {minWidth / 2}px + {zoomOffsetBotX * 3 - spreadBotX}px);
		top: calc(402px - {minHeight / 2}px + {zoomOffsetBotY * 3 + spreadBotY}px);"
	>
		<path
			d="M1 10L15 33L3.4609 53.0011C1.92244 55.6678 3.84701 59 6.92564 59H100L109 50H180L193 63H208V48H191L180 37H66L55 26H33L18 1L1 10Z"
		/>
	</svg>
	<svg
		class="cursor"
		width="209"
		height="64"
		viewBox="0 0 209 64"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="
			left: calc(274px - {minWidth / 2}px + {zoomOffsetBotX * 3 + spreadBotX}px);
			top: calc(402px - {minHeight / 2}px + {zoomOffsetBotY * 3 + spreadBotY}px);"
	>
		<path
			d="M208 10L194 33L205.539 53.0011C207.078 55.6678 205.153 59 202.074 59H109L100 50H29L16 63H1V48H18L29 37H143L154 26H176L191 1L208 10Z"
		/>
	</svg>
	<svg
		class="cursor"
		width="113"
		height="207"
		viewBox="0 0 113 207"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="
		left: calc(0px - {minWidth / 2}px + {zoomOffsetLeftX * 3 - spreadLeftX}px);
		top: calc(192px - {minHeight / 2}px + {zoomOffsetLeftY * 3 - spreadLeftY}px);"
	>
		<path
			d="M41.9998 206L27.9998 183H4.91236C1.83669 183 -0.0882524 179.674 1.4443 177.007L47.9997 96L59.9998 93L95.9998 31L91 14L98.9998 1L112 8L103 23L107 38L49.9998 137L53.9998 152L42.9998 171L57.9998 197L41.9998 206Z"
		/>
	</svg>
	<svg
		class="cursor"
		width="151"
		height="183"
		viewBox="0 0 151 183"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="
		left: calc(109px - {minWidth / 2}px + {zoomOffsetLeftX * 3 + spreadLeftX}px);
		top: calc(0px - {minHeight / 2}px + {zoomOffsetLeftY * 3 + spreadLeftY}px);"
	>
		<path
			d="M14 182L22 168L37 164L94 65L109 61L120 42H150V23H123L111.451 2.98239C109.915 0.319397 106.074 0.312965 104.529 2.9708L58 83L61 96L26 157L8 162L1 175L14 182Z"
		/>
	</svg>

	<svg
		class="cursor"
		width="113"
		height="207"
		viewBox="0 0 113 207"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="
		left: calc(418px - {minWidth / 2}px + {zoomOffsetRightX * 3 + spreadRightX}px);
		top: calc(192px - {minHeight / 2}px + {zoomOffsetRightY * 3 + spreadRightY}px);"
	>
		<path
			d="M71.0002 206L85.0002 183H108.088C111.163 183 113.088 179.674 111.556 177.007L65.0003 96L53.0002 93L17.0002 31L22 14L14.0002 1L1.00019 8L10.0002 23L6.00019 38L63.0002 137L59.0002 152L70.0002 171L55.0002 197L71.0002 206Z"
		/>
	</svg>
	<svg
		class="cursor"
		width="151"
		height="183"
		viewBox="0 0 151 183"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="
		left: calc(274px - {minWidth / 2}px + {zoomOffsetRightX * 3 - spreadRightX}px);
		top: calc(0px - {minHeight / 2}px + {zoomOffsetRightY * 3 - spreadRightY}px);"
	>
		<path
			d="M137 182L129 168L114 164L57 65L42 61L31 42H1V23H28L39.5486 2.98239C41.085 0.319397 44.9261 0.312965 46.4714 2.9708L93 83L90 96L125 157L143 162L150 175L137 182Z"
		/>
	</svg>

	<!-- LIGHTS -->
	<svg
		class="light"
		width="60"
		height="9"
		viewBox="0 0 60 9"
		xmlns="http://www.w3.org/2000/svg"
		style="
		left: calc(238px - {minWidth / 2}px + {zoomOffsetBotX * 6}px);
		top: calc(438px - {minHeight / 2}px + {zoomOffsetBotY * 6}px);"
	>
		<g filter="url(#blur-filter)">
			<path d="M58 2L53 7H7L2 2H58Z" fill="url(#light-grad)" />
		</g>
	</svg>
	<svg
		class="light left"
		width="60"
		height="9"
		viewBox="0 0 60 9"
		xmlns="http://www.w3.org/2000/svg"
		style="
		left: calc(97px - {minWidth / 2}px + {zoomOffsetLeftX * 6}px);
		top: calc(193px - {minHeight / 2}px + {zoomOffsetLeftY * 6}px);"
	>
		<g filter="url(#blur-filter)">
			<path d="M58 2L53 7H7L2 2H58Z" fill="url(#light-grad)" />
		</g>
	</svg>
	<svg
		class="light right"
		width="60"
		height="9"
		viewBox="0 0 60 9"
		xmlns="http://www.w3.org/2000/svg"
		style="
		left: calc(379px - {minWidth / 2}px + {zoomOffsetRightX * 6}px);
		top: calc(193px - {minHeight / 2}px + {zoomOffsetRightY * 6}px);"
	>
		<g filter="url(#blur-filter)">
			<path d="M58 2L53 7H7L2 2H58Z" fill="url(#light-grad)" />
		</g>
	</svg>

	<!-- DEFINITIONS -->
	<svg>
		<defs>
			<filter
				id="blur-filter"
				x="0"
				y="0"
				width="60"
				height="9"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
				<feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_73_23" />
			</filter>
			<radialGradient
				id="light-grad"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(2 5.00003) scale(56 627.2)"
			>
				<stop stop-color="#1F5C7A" stop-opacity="0" />
				<stop offset="0.2" stop-color="#269DD9" stop-opacity="0.5" />
				<stop offset="0.5" stop-color="#DEE8ED" />
				<stop offset="0.8" stop-color="#269DD9" stop-opacity="0.5" />
				<stop offset="1" stop-color="#1F5C7A" stop-opacity="0" />
			</radialGradient>
		</defs>
	</svg>
</div>

<style>
	:root {
		--cursor-blue: hsl(200, 100%, 75%, 0.1);
		--buffer-blue: hsl(200, 100%, 75%, 0.2);
		--line-blue: hsl(200, 100%, 80%, 0.4);
	}


	#cursor {
		position: absolute;
		translate: -50% -50%;
		transition-property: left, top, width, height;
		transition-duration: 0.1s;
		transition-timing-function: linear;
		border: solid red 1px;
	}

	#cursor > * {
		position: absolute;
		transition-property: left, top;
	}

	.cursor {
		fill: var(--cursor-blue);
		stroke: var(--line-blue);
		stroke-width: 1.5;

		transition-duration: 0.1s;
		transition-delay: 0.05s;
	}

	.buffer {
		fill: var(--buffer-blue);
		stroke: var(--line-blue);
		stroke-width: 1.5;
		transition-duration: 0.1s;
	}

	.light {
		transition-delay: 0.075s;
		transition-duration: 0.1s;
	}

	.left {
		rotate: 120deg;
	}

	.right {
		rotate: -120deg;
	}
</style>
