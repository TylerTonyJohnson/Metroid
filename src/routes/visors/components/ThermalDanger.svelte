<!-- LOGIC -->
<script>
	import { currentDanger } from '../../../lib/stores';

	const maxCounterX = 194;
	const maxCounterY = 336;

	$: dangerPositionX = ($currentDanger / 100) * maxCounterX;
	$: dangerPositionY = ($currentDanger / 100) * maxCounterY;
</script>

<!-- BAR -->
<svg
	class="bar-svg"
	width="203px"
	height="336px"
	viewBox="0 0 203 336"
	xmlns="http://www.w3.org/2000/svg"
>
	<path class="bar-empty" d="M194 0H203L9 336H0L194 0Z" />
	<path class="bar-full" d="M194 0H203L9 336H0L194 0Z" fill="url(#dangerGradient)" />
	<defs>
		<linearGradient id="dangerGradient" x1="0" x2="0" y1="100%" y2="0">
			<stop offset="{$currentDanger}%" stop-color="hsl(200, 100%, 85%, 80%)" />
			<stop offset="{0}%" stop-color="transparent" />
		</linearGradient>
	</defs>
</svg>

<!-- COUNTER -->
<svg
	class="counter-svg"
	width="87"
	height="73"
	viewBox="0 0 87 73"
	xmlns="http://www.w3.org/2000/svg"
	style="
        right: calc(50% + 322px - {dangerPositionX}px);
        top: calc(50% + 21px - {dangerPositionY}px);    
    "
>
	<!-- TRIANGLE -->
	<path class="triangle" d="M76 38L72 45L79 63L60 66L56 73L87 68L76 38Z" />
	<path class="triangle" d="M68 51L71 58L64 59L68 51Z" />
	<!-- ICON -->
	<path class="icon-border" d="M30 62L42 55V9L30 2M14 2L2 9V55L14 62" />
    <text class='icon' x='16' y='46'>!</text>
</svg>

<!-- STYLE -->
<style>
    :root {
        --light-blue: hsl(200, 100%, 75%, 40%);
        --bright-blue: hsl(200, 100%, 95%, 60%);
    }

	.bar-svg {
		position: absolute;
		width: 203px;
		height: 336px;
		right: calc(50% + 111px);
		top: calc(50% - 246px);
	}

	.bar-empty {
		fill: var(--light-blue);
	}

	.triangle {
		fill: var(--light-blue);
	}

	.counter-svg {
		position: absolute;
	}

	.icon-border {
		stroke: var(--light-blue);
        stroke-width: 4;
		fill: none;
	}

	.icon {
		font-family: 'vdl-gigajr', sans-serif;
        font-size: 38px;
		fill: var(--bright-blue);
	}
</style>
