<script>
	import { onMount } from "svelte";
    let startTimer;

    onMount(() => {
        startTimer = performance.now();
        console.log(startTimer);
    })

</script>

<div></div>

<style>
	div {
		position: absolute;
        height: 20px;
        width: 200px;
        background-color: white;
        left: 50%;
        top: 65%;
        translate: -50% -50%;
	}
</style>
