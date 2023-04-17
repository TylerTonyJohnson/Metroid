<script>
	import World from './World.svelte';
	import Visor from './Visor.svelte';
</script>

<div id='body'>
	<Visor />
	<World />
</div>

<style>
:global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

    #body {
        width: 100vw;
        height: 100vh;
        position: relative;
        overflow: hidden;
    }
</style>
