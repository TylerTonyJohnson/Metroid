<script>
	import { currentAmmo, maxAmmo } from '../../../lib/stores';

	$: ammoPercent = ($currentAmmo / $maxAmmo) * 100;

	$: currentAmmoHundreds = Math.floor(($currentAmmo / 100) % 10);
	$: currentAmmoTens = Math.floor(($currentAmmo / 10) % 10);
	$: currentAmmoOnes = Math.floor(($currentAmmo / 1) % 10);
	$: maxAmmoHundreds = Math.floor(($maxAmmo / 100) % 10);
	$: maxAmmoTens = Math.floor(($maxAmmo / 10) % 10);
	$: maxAmmoOnes = Math.floor(($maxAmmo / 1) % 10);

	let message;

	$: switch (true) {
		case ammoPercent === 0:
			message = 'Depleted';
			break;
		case ammoPercent > 0 && ammoPercent <= 20:
			message = 'Missiles Low';
			break;
		case ammoPercent > 20:
			message = '';
			break;
	}

</script>

<div id="frame">
	<div id="ammo-counter">
		<!-- BAR -->
		<svg id="bar" viewBox="0 0 12 326" xmlns="http://www.w3.org/2000/svg">
			<rect width="12" height="326" rx="2" fill="#5999A6" fill-opacity="0.8" />
			<rect
				x="1"
				y="{100 - ammoPercent}%"
				width="10"
				height="{ammoPercent}%"
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
			style="bottom: {ammoPercent}%;"
			viewBox="0 0 333 140"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<!-- Line -->
			<path d="M135 86L221 86" stroke="#A3E7F5" stroke-opacity="0.9" stroke-width="3" />
			<!-- Numbers -->
			<text x="148" y="65" class="ammo-num">{currentAmmoHundreds}</text>
			<text x="177" y="65" class="ammo-num">{currentAmmoTens}</text>
			<text x="206" y="65" class="ammo-num">{currentAmmoOnes}</text>
			<text x="148" y="118" class="ammo-num">{maxAmmoHundreds}</text>
			<text x="177" y="118" class="ammo-num">{maxAmmoTens}</text>
			<text x="206" y="118" class="ammo-num">{maxAmmoOnes}</text>
			<!-- Arrow -->
			<path d="M320.5 76V79.843L328.19 86L320.5 92.156V96L333 86L320.5 76Z" fill="#5999A6" fill-opacity="0.8" />
    		<path d="M320.5 83.686L323.39 86L320.5 88.314V83.686Z" fill="#5999A6" fill-opacity="0.8" />
			<!-- Boxy -->
			<path
			d="M242 121L249 128H305L312 121M242 51L249 44H305L312 51M314.5 120C314.5 120.828 313.828 121.5 313 121.5C312.172 121.5 311.5 120.828 311.5 120C311.5 119.172 312.172 118.5 313 118.5C313.828 118.5 314.5 119.172 314.5 120ZM314.5 52C314.5 52.8284 313.828 53.5 313 53.5C312.172 53.5 311.5 52.8284 311.5 52C311.5 51.1716 312.172 50.5 313 50.5C313.828 50.5 314.5 51.1716 314.5 52ZM242.5 120C242.5 120.828 241.828 121.5 241 121.5C240.172 121.5 239.5 120.828 239.5 120C239.5 119.172 240.172 118.5 241 118.5C241.828 118.5 242.5 119.172 242.5 120ZM242.5 52C242.5 52.8284 241.828 53.5 241 53.5C240.172 53.5 239.5 52.8284 239.5 52C239.5 51.1716 240.172 50.5 241 50.5C241.828 50.5 242.5 51.1716 242.5 52Z"
			stroke="#5999A6" stroke-opacity="0.8" />
			<!-- Missile -->
			<path d="M277 59C272.029 59 268 63.0294 268 68V77H286V68C286 63.0294 281.971 59 277 59Z" fill="#A3E7F5"
        fill-opacity="0.9" />
    		<path d="M269 80V94H285V80H269Z" fill="#A3E7F5" fill-opacity="0.9" />
    		<path d="M256 108V113H264V100L256 108Z" fill="#A3E7F5" fill-opacity="0.9" />
    		<path d="M298 108V113H290V100L298 108Z" fill="#A3E7F5" fill-opacity="0.9" />
    		<path d="M267 97V113H275V101H279V113H287V97H267Z" fill="#A3E7F5" fill-opacity="0.9" />
			<!-- Message -->
			<text class="message" x="151" y="16" fill="white">{message}</text>
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
		height: 30.19%;
		right: 10.6%;
		top: 35%;
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
		height: 33.13%;
		right: 200%;
		translate: 0 38%;
		transform: rotateY(-15deg);
		transform-origin: right;
	}

	.ammo-num {
		font-family: 'Metroid';
		fill: #a3e7f5;
		stroke-width: 4;
		paint-order: stroke;
		font-size: 270%;
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
</style>
