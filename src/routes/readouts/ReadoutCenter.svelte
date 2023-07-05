<script>
	import { fly, fade } from 'svelte/transition';
</script>

<div id="readout" transition:fade={{ duration: 250 }}>
	<!-- BACKDROP -->
	<svg
		id="backdrop"
		width="1920"
		height="1080"
		viewBox="0 0 1920 1080"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width="1920" height="1080" fill="url(#backdrop-gradient)" />
	</svg>
	<!-- MID SANDWICH -->
	<svg
		id="mid-sandwich"
		width="1920"
		height="1080"
		viewBox="0 0 1920 1080"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<!-- BLUE BANNER -->
		<rect x="402" y="414" width="1116" height="252" fill="url(#blue-banner)" />
		<!-- SIDE WINGS -->
		<path class="wing" d="M390 506L400 500V580L390 574V506Z" />
		<path class="wing" d="M1530 506L1520 500V580L1530 574V506Z" />
		<!-- MESSAGE TEXT -->
		<text class="text" x="50%" y="50%">
			<slot />
		</text>
	</svg>
	<!-- TOP SANDWICH -->
	<svg
		in:fly={{ y: -100, duration: 250 }}
		out:fly={{ y: -100, duration: 250 }}
		id="top-sandwich"
		width="1920"
		height="540"
		viewBox="0 0 1920 540"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<!-- FRAMES -->
		<path
			class="wing"
			d="M877 394H737L767.485 363.515C769.736 361.264 772.788 360 775.971 360H887.74C890.439 360 892.999 361.199 894.727 363.273C899.336 368.803 906.162 372 913.36 372H1006.64C1013.84 372 1020.66 368.803 1025.27 363.273C1027 361.199 1029.56 360 1032.26 360H1144.03C1147.21 360 1150.26 361.264 1152.51 363.515L1183 394H1043L1029 380H891L877 394Z"
		/>
		<path class="frame-back" d="M390 421L397 414L405 423L400 428V472L390 478V421Z" />
		<path class="frame-back" d="M1530 421L1523 414L1515 423L1520 428V472L1530 478V421Z" />
		<path
			class="frame-back"
			d="M416 412L411 417L402 409L409 402H880L894 388H1026L1040 402H1511L1518 409L1509 417L1504 412H416Z"
		/>
		<path
			class="frame-front"
			d="M410.56 408.708L405.51 413.825L396.42 405.637L403.49 398.473H879.2L893.34 384.144H1026.66L1040.8 398.473H1516.51L1523.58 405.637L1514.49 413.825L1509.44 408.708H410.56Z"
		/>
		<path
			class="frame-front"
			d="M384.3 417.919L391.37 410.755L399.45 419.966L394.4 425.084V470.118L384.3 476.259V417.919Z"
		/>
		<path
			class="frame-front"
			d="M1535.7 417.919L1528.63 410.755L1520.55 419.966L1525.6 425.084V470.118L1535.7 476.259V417.919Z"
		/>

		<!-- WIRE -->
		<mask
			id="top-wire-mask"
			style="mask-type:alpha"
			maskUnits="userSpaceOnUse"
			x="0"
			y="339"
			width="1920"
			height="126"
		>
			<path
				d="M0 464H346C359.255 464 370 453.255 370 440V422.941C370 416.576 372.529 410.471 377.029 405.971L393.971 389.029C398.471 384.529 404.576 382 410.941 382H710.059C716.424 382 722.529 379.471 727.029 374.971L754.971 347.029C759.471 342.529 765.576 340 771.941 340H888.78C894.73 340 900.483 342.128 905 346V346C909.517 349.872 915.27 352 921.22 352H998.78C1004.73 352 1010.48 349.872 1015 346V346C1019.52 342.128 1025.27 340 1031.22 340H1148.06C1154.42 340 1160.53 342.529 1165.03 347.029L1192.97 374.971C1197.47 379.471 1203.58 382 1209.94 382H1509.06C1515.42 382 1521.53 384.529 1526.03 389.029L1542.97 405.971C1547.47 410.471 1550 416.576 1550 422.941V440C1550 453.255 1560.75 464 1574 464H1920"
				stroke="white"
				stroke-opacity="0.5"
			/>
		</mask>
		<g mask="url(#top-wire-mask)">
			<rect width="1920" height="540" fill="url(#top-wire-mask-gradient)" />
		</g>
	</svg>
	<!-- BOT SANDWICH -->
	<svg
		in:fly={{ y: 100, duration: 250 }}
		out:fly={{ y: 100, duration: 250 }}
		id="bot-sandwich"
		width="1920"
		height="540"
		viewBox="0 0 1920 540"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<!-- BUTTON -->
		<circle cx="960" cy="176" r="36" fill="url(#paint0_radial_143_43)" />
		<g filter="url(#filter0_d_143_43)">
			<path
				d="M953.4 187H950.63L958.642 165.182H961.369L969.38 187H966.61L960.091 168.634H959.92L953.4 187ZM954.423 178.477H965.588V180.821H954.423V178.477Z"
				fill="#B8D3E0"
			/>
		</g>
		<g filter="url(#filter1_d_143_43)">
			<circle cx="960" cy="176" r="21.5" stroke="#B8D3E0" stroke-opacity="0.6" stroke-width="3" />
		</g>
		<!-- WINGS -->
		<path
			class="wing"
			d="M1011.66 182C1011.88 180.031 1012 178.029 1012 176C1012 171.15 1011.34 166.454 1010.09 162H1030L1044 148H1108L1092.43 175.854C1090.31 179.649 1086.31 182 1081.96 182H1011.66Z"
		/>
		<path
			class="wing"
			d="M908.342 182H838.041C833.693 182 829.686 179.649 827.565 175.854L812 148H876L890 162H909.906C908.664 166.454 908 171.15 908 176C908 178.029 908.116 180.031 908.342 182Z"
		/>
		<!-- CIRCLE FRAME -->
		<path
			class="frame-back"
			d="M968 219.274C988.481 215.512 1004 197.569 1004 176C1004 154.431 988.481 136.488 968 132.726V140.81C984.076 144.449 996.08 158.823 996.08 176C996.08 193.177 984.076 207.551 968 211.19V219.274Z"
		/>
		<path
			class="frame-back"
			d="M952 219.274C931.519 215.512 916 197.569 916 176C916 154.431 931.519 136.488 952 132.726V140.81C935.924 144.449 923.92 158.823 923.92 176C923.92 193.177 935.924 207.551 952 211.19V219.274Z"
		/>
		<path
			class="frame-front"
			d="M968.079 224.144C988.764 220.293 1004.44 201.928 1004.44 179.852C1004.44 157.777 988.764 139.411 968.079 135.561V143.835C984.316 147.56 996.439 162.271 996.439 179.852C996.439 197.433 984.316 212.144 968.079 215.869V224.144Z"
		/>
		<path
			class="frame-front"
			d="M951.919 224.144C931.233 220.293 915.559 201.928 915.559 179.852C915.559 157.777 931.233 139.411 951.919 135.561V143.835C935.681 147.56 923.558 162.271 923.558 179.852C923.558 197.433 935.681 212.144 951.919 215.869V224.144Z"
		/>

		<!-- FRAME -->
		<path class="frame-back" d="M390 119L397 126L405 117L400 112V68L390 62V119Z" />
		<path class="frame-back" d="M1530 119L1523 126L1515 117L1520 112V68L1530 62V119Z" />
		<path
			class="frame-back"
			d="M411 123L416 128H939.965C928.71 132.703 919.46 141.25 913.858 152H894L880 138H409L402 131L411 123Z"
		/>
		<path
			class="frame-back"
			d="M1006.14 152H1026L1040 138H1511L1518 131L1509 123L1504 128H980.035C991.29 132.703 1000.54 141.25 1006.14 152Z"
		/>
		<path
			class="frame-front"
			d="M384.3 121.513L391.37 128.677L399.45 119.466L394.4 114.348V69.314L384.3 63.173V121.513Z"
		/>
		<path
			class="frame-front"
			d="M1535.7 121.513L1528.63 128.677L1520.55 119.466L1525.6 114.348V69.314L1535.7 63.173V121.513Z"
		/>
		<path
			class="frame-front"
			d="M405.51 125.607L410.56 130.724H939.764C928.396 135.538 919.055 144.286 913.396 155.288H893.34L879.2 140.959H403.49L396.42 133.795L405.51 125.607Z"
		/>
		<path
			class="frame-front"
			d="M1006.6 155.288H1026.66L1040.8 140.959H1516.51L1523.58 133.795L1514.49 125.607L1509.44 130.724H980.235C991.603 135.538 1000.94 144.286 1006.6 155.288Z"
		/>

		<mask
			id="bot-wire-mask"
			style="mask-type:alpha"
			maskUnits="userSpaceOnUse"
			x="0"
			y="75"
			width="1920"
			height="126"
		>
			<path
				d="M900 200H833.644C825.184 200 817.349 195.546 813.021 188.276L801.979 169.724C797.651 162.454 789.816 158 781.356 158H410.941C404.576 158 398.471 155.471 393.971 150.971L377.029 134.029C372.529 129.529 370 123.424 370 117.059V100C370 86.7452 359.255 76 346 76H0M1020 200H1086.36C1094.82 200 1102.65 195.546 1106.98 188.276L1118.02 169.724C1122.35 162.454 1130.18 158 1138.64 158H1509.06C1515.42 158 1521.53 155.471 1526.03 150.971L1542.97 134.029C1547.47 129.529 1550 123.424 1550 117.059V100C1550 86.7452 1560.75 76 1574 76H1920"
				stroke="white"
				stroke-opacity="0.5"
			/>
		</mask>
		<g mask="url(#bot-wire-mask)">
			<rect width="1920" height="540" fill="url(#bot-wire-mask-gradient)" />
		</g>
	</svg>
	<!-- DEFINITIONS -->
	<svg width="0" height="0">
		<defs>
			<!-- BACKDROP -->
			<radialGradient
				id="backdrop-gradient"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(960 540) rotate(90) scale(540 960)"
			>
				<stop offset="0.4" stop-color="#060604" stop-opacity="0.3" />
				<stop offset="1" stop-opacity="0.7" />
			</radialGradient>
			<!-- MESSAGE BANNER -->
			<linearGradient
				id="blue-banner"
				x1="1518"
				y1="414"
				x2="402"
				y2="414"
				gradientUnits="userSpaceOnUse"
			>
				<stop stop-opacity="0" />
				<stop offset="0.213542" stop-color="#000A0F" stop-opacity="0.6" />
				<stop offset="0.744792" stop-color="#000A0F" stop-opacity="0.6" />
				<stop offset="1" stop-opacity="0" />
			</linearGradient>
			<!-- WIRE -->
			<linearGradient
				id="top-wire-mask-gradient"
				x1="1920"
				y1="0"
				x2="0"
				y2="0"
				gradientUnits="userSpaceOnUse"
			>
				<stop />
				<stop offset="0.210161" stop-color="white" />
				<stop offset="0.768689" stop-color="white" />
				<stop offset="1" />
			</linearGradient>
			<filter
				id="filter0_d_143_43"
				x="942.63"
				y="157.182"
				width="34.75"
				height="37.8182"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feOffset />
				<feGaussianBlur stdDeviation="4" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.666667 0 0 0 0 1 0 0 0 0.53 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_143_43" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_143_43" result="shape" />
			</filter>
			<filter
				id="filter1_d_143_43"
				x="929"
				y="145"
				width="62"
				height="62"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feOffset />
				<feGaussianBlur stdDeviation="4" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.666667 0 0 0 0 1 0 0 0 0.53 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_143_43" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_143_43" result="shape" />
			</filter>
			<radialGradient
				id="paint0_radial_143_43"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(960 176) rotate(90) scale(36)"
			>
				<stop stop-color="#000A0F" stop-opacity="0.6" />
				<stop offset="1" stop-color="#1D2884" stop-opacity="0" />
			</radialGradient>
			<linearGradient
				id="bot-wire-mask-gradient"
				x1="1920"
				y1="0"
				x2="0"
				y2="0"
				gradientUnits="userSpaceOnUse"
			>
				<stop />
				<stop offset="0.2" stop-color="white" />
				<stop offset="0.4" stop-color="white" />
				<stop offset="0.47" />
				<stop offset="0.53" />
				<stop offset="0.60" stop-color="white" />
				<stop offset="0.80" stop-color="white" />
				<stop offset="1" />
			</linearGradient>
		</defs>
	</svg>
</div>

<style>
	:root {
		--readout-pale-fill: hsl(200, 20%, 20%, 50%);
		--readout-pale-stroke: hsl(200, 20%, 80%, 50%);
		--readount-med-fill: hsl(200, 30%, 40%, 75%);
		--readout-med-stroke: hsl(200, 40%, 80%, 60%);
	}

	#readout {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		animation: fade-in 0.25s ease-out;
	}

	#readout > * {
		position: absolute;
	}

	#backdrop {
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		background: linear-gradient(
			hsl(240, 20%, 12%, 70%),
			hsl(240, 20%, 12%, 30%),
			hsl(240, 20%, 12%, 70%)
		);
		background-size: auto 10px;
	}

	#mid-sandwich {
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	#top-sandwich {
		left: 50%;
		translate: -50% 0;
		bottom: 50%;
		animation: slide-down 0.25s ease-out;
	}

	#bot-sandwich {
		/* position: absolute; */
		left: 50%;
		translate: -50% 0;
		top: 50%;
		animation: slide-up 0.25s ease-out;
	}

	.wing {
		fill: var(--readout-pale-fill);
	}
	.frame-back {
		fill: var(--readout-pale-fill);
		stroke: var(--readout-pale-stroke);
		stroke-width: 2;
	}
	.frame-front {
		fill: var(--readount-med-fill);
		stroke: var(--readout-med-stroke);
		stroke-width: 2;
	}

	.text {
		font-family: 'Metroid';
		fill: #ccffff;
		stroke: hsl(200, 80%, 30%, 60%);
		stroke-width: 4;
		paint-order: stroke;
		font-size: 200%;
		dominant-baseline: central;
		text-anchor: middle;


		/* dominant-baseline: middle;
		text-anchor: middle;
		font-family: 'Metroid';
		font-weight: 1000;
		font-style: bold;
		font-size: 38px;
		line-height: 100%;
		fill: hsl(192, 90%, 90%);
		text-shadow: 0 0 20px hsl(200, 80%, 80%), 0 0 5px hsl(200, 80%, 10%); */
	}

	/* @keyframes slide-down {
		from {
			transform: translateY(-100%);
		}
		to {
			transform: translateY(0px);
		}
	}
	@keyframes slide-up {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0px);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	} */
</style>
