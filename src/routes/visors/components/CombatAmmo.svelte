<script>
	import { currentAmmo, maxAmmo } from '../../../lib/stores';

    $: ammoPercent = $currentAmmo / $maxAmmo * 100;

    $: currentAmmoHundreds = Math.floor(($currentAmmo / 100) % 10);
    $: currentAmmoTens = Math.floor(($currentAmmo / 10) % 10);
    $: currentAmmoOnes = Math.floor(($currentAmmo / 1) % 10);
    $: maxAmmoHundreds = Math.floor(($maxAmmo / 100) % 10);
    $: maxAmmoTens = Math.floor(($maxAmmo / 10) % 10);
    $: maxAmmoOnes = Math.floor(($maxAmmo / 1) % 10);
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
        <!-- ARROW -->
		<svg
			id="arrow"
			viewBox="0 0 198 108"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
            style='bottom: {ammoPercent}%;'
		>
			<path d="M0 54L86 54" stroke="#A3E7F5" stroke-opacity="0.9" stroke-width="3" />
            <text x='14' y='25' class='ammo-num'>{currentAmmoHundreds}</text>
            <text x='43' y='25' class='ammo-num'>{currentAmmoTens}</text>
            <text x='72' y='25' class='ammo-num'>{currentAmmoOnes}</text>
            <text x='14' y='82' class='ammo-num'>{maxAmmoHundreds}</text>
            <text x='43' y='82' class='ammo-num'>{maxAmmoTens}</text>
            <text x='72' y='82' class='ammo-num'>{maxAmmoOnes}</text>
			<path
				d="M185.5 44V47.843L193.19 54L185.5 60.156V64L198 54L185.5 44Z"
				fill="#5999A6"
				fill-opacity="0.8"
			/>
			<path d="M185.5 51.686L188.39 54L185.5 56.314V51.686Z" fill="#5999A6" fill-opacity="0.8" />
			<path
				d="M107 89L114 96H170L177 89M107 19L114 12H170L177 19M179.5 88C179.5 88.8284 178.828 89.5 178 89.5C177.172 89.5 176.5 88.8284 176.5 88C176.5 87.1716 177.172 86.5 178 86.5C178.828 86.5 179.5 87.1716 179.5 88ZM179.5 20C179.5 20.8284 178.828 21.5 178 21.5C177.172 21.5 176.5 20.8284 176.5 20C176.5 19.1716 177.172 18.5 178 18.5C178.828 18.5 179.5 19.1716 179.5 20ZM107.5 88C107.5 88.8284 106.828 89.5 106 89.5C105.172 89.5 104.5 88.8284 104.5 88C104.5 87.1716 105.172 86.5 106 86.5C106.828 86.5 107.5 87.1716 107.5 88ZM107.5 20C107.5 20.8284 106.828 21.5 106 21.5C105.172 21.5 104.5 20.8284 104.5 20C104.5 19.1716 105.172 18.5 106 18.5C106.828 18.5 107.5 19.1716 107.5 20Z"
				stroke="#5999A6"
				stroke-opacity="0.8"
			/>
			<path
				d="M142 27C137.029 27 133 31.0294 133 36V45H151V36C151 31.0294 146.971 27 142 27Z"
				fill="#A3E7F5"
				fill-opacity="0.9"
			/>
			<path d="M134 48V62H150V48H134Z" fill="#A3E7F5" fill-opacity="0.9" />
			<path d="M121 76V81H129V68L121 76Z" fill="#A3E7F5" fill-opacity="0.9" />
			<path d="M163 76V81H155V68L163 76Z" fill="#A3E7F5" fill-opacity="0.9" />
			<path d="M132 65V81H140V69H144V81H152V65H132Z" fill="#A3E7F5" fill-opacity="0.9" />
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
		width: 11.61%;
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

    #arrow {
		position: absolute;
		height: 33.13%;
		left: 0;
		translate: 0 50%;
		transform: rotateY(-15deg);
		transform-origin: right;
        /* background-color: red; */
	}

    .ammo-num {
        font-family: 'Metroid';
		fill: #a3e7f5;
		stroke-width: 4;
		paint-order: stroke;
		font-size: 230%;
		dominant-baseline: central;
		text-anchor: middle;
    }
</style>
