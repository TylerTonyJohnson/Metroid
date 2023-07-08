<div id='cursor'>
    <div class='buffer'/>
    <img id="focus" src="Scan Cursor.svg" alt="decoration" />
    <div class='buffer' />
</div>
<img id='aim-cursor' src='Scan Cursor Static 1x.png' alt='static'/>
<img class='spinner inner' src='Scan Cursor Spin Inner 1x.png' />
<img class='spinner outer' src='Scan Cursor Spin Outer 1x.png' />

<style>
	#cursor {
		position: absolute;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	#focus {
		height: 100vh;
	}

	.buffer {
		background-color: rgba(0,0,0,0.5);
		width: 100%;
		height: 100%;
	}

	#aim-cursor {
		position: absolute;
		height: calc(142%/1080*100);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.spinner {
		position: absolute;
		left:50%;
		top: 50%;
		translate: -50% -50%;
	}

	.inner {
		height: calc(648%/1080*100);
		animation: rotate 10s linear infinite;
	}

	.outer {
		height: calc(708%/1080*100);
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
</style>