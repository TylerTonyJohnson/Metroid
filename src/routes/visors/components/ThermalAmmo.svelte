<!-- LOGIC -->
<script>
	import { currentAmmo, maxAmmo } from '../../../lib/stores';

	const maxCounterX = 194;
	const maxCounterY = 336;

	$: ammoPositionX = ($currentAmmo / $maxAmmo) * maxCounterX;
	$: ammoPositionY = ($currentAmmo / $maxAmmo) * maxCounterY;

    $: padCurAmmo = ('000' + $currentAmmo).slice(-3);
    $: padMaxAmmo = ('000' + $maxAmmo).slice(-3);
</script>

<!-- BAR -->
<svg
	class="bar-svg"
	width="203px"
	height="336px"
	viewBox="0 0 203 336"
	xmlns="http://www.w3.org/2000/svg"
>
	<path class="bar-empty" d="M9 0H0L194 336H203L9 0Z" />
	<path class="bar-full" d="M9 0H0L194 336H203L9 0Z" fill="url(#ammoGradient)" />
	<defs>
		<linearGradient id="ammoGradient" x1="0" x2="0" y1="100%" y2="0">
			<stop offset="{$currentAmmo/$maxAmmo * 100}%" stop-color="hsl(200, 100%, 85%, 80%)" />
			<stop offset="{0}%" stop-color="transparent" />
		</linearGradient>
	</defs>
</svg>

<!-- COUNTER -->
<svg
	class="counter-svg"
	width="223"
	height="114"
	viewBox="0 0 223 114"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	style="
    left: calc(50% + 322px - {ammoPositionX}px);
    top: calc(50% + 13px - {ammoPositionY}px);"
>
    <!-- TRIANGLE ARROW -->
	<path class="triangle" d="M11 47L15 54L8 72L27 75L31 82L0 77L11 47Z" />
	<path class="triangle" d="M19 60L16 67L23 68L19 60Z" />
    <!-- MISSILE ICON -->
	<path
		class="icon-path"
		d="M66 26C61.0294 26 57 30.0294 57 35V44H75V35C75 30.0294 70.9706 26 66 26Z"
	/>
	<path class="icon-path" d="M58 47V61H74V47H58Z" />
	<path class="icon-path" d="M45 75V80H53V67L45 75Z" />
	<path class="icon-path" d="M87 75V80H79V67L87 75Z" />
	<path class="icon-path" d="M56 64V80H64V68H68V80H76V64H56Z" />
    <!-- MISSILE COUNT -->
	<path class="icon-line" d="M100 57H198" />
	<text class="icon" x="105" y="42">{padCurAmmo}</text>
	<text class="icon" x="105" y="102">{padMaxAmmo}</text>
</svg>

<!-- STYLE -->
<style>
	:root {
		--icon-light-blue: hsl(200, 50%, 75%, 40%);
		--bright-blue: hsl(200, 100%, 95%, 60%);
	}

	.bar-svg {
		position: absolute;
		width: 203px;
		height: 336px;
		left: calc(50% + 111px);
		top: calc(50% - 246px);
	}

	.bar-empty {
		fill: var(--icon-light-blue);
	}

	.triangle {
		fill: var(--icon-light-blue);
	}

	.counter-svg {
		position: absolute;
	}

	.icon-path {
		fill: var(--icon-light-blue);
	}

	.icon-line {
		stroke: var(--icon-light-blue);
		stroke-width: 2;
	}

	.icon {
		font-family: 'vdl-gigajr', sans-serif;
		font-size: 38px;
		fill: var(--icon-light-blue);
	}
</style>
