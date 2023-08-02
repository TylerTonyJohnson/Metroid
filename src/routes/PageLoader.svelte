<script>
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { navigationState } from '../lib/stores';
	import { onDestroy, onMount } from 'svelte';

	const progress = tweened(0, {
		duration: 3500,
		easing: cubicOut
	});

	const unsubscribe = navigationState.subscribe((state) => {
		if (state === 'loaded') {
			progress.set(1, { duration: 1000 });
		}
	});

	onMount(() => {
		progress.set(0.5);
	});
</script>

<div id="frame">
	<div id="progress-container">
		<div id="progress-sliver" style='width: {$progress * 100}%;'/>
	</div>
</div>

<style>
	#frame {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}

	#progress-container {
		position: absolute;
		height: 30px;
		width: 500px;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		background-color: red;
	}

	#progress-sliver {
		position: absolute;
		height: 100%;
		width: 50%;
		left: 0;
		top: 0;
		background-color: blue;
	}
</style>
