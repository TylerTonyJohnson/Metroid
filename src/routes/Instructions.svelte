<div id='instructions'>
    <h1 class='title'>THINGS TO DO</h1>
    <ul id='words'>
        <!-- Visuals -->
        <li class='must'>Research shaders</li>
        <li class='must'>Use svelte tweens for sliding objects?</li>
        <!-- Three-Dee -->
        <li class='must'>Make the seeker list only grab what's targetable (distance, scan)</li>
        <li class='must'>I really need to have some pickups that adjust health, ammo, danger</li>
        <li class='nice'>Shaders</li>
        <li class='nice'>Make sounds fade out as they stop playing - Tween Library?</li>
        <!-- After Finish -->
        <li class='must'>Make an instructions page</li>
        <li class='must'>Make a "controls" display</li>
        <!-- Optimization -->
        <li class='nice'>Put component files in nice folders</li>
        <li class='nice'>Standardize and centralize colors and styles into root</li>
        <li class='nice'>Go through static folder and clean things up</li>
        <li class='nice'>Clean up on Firefox (transforms not working?)</li>
        <!-- Finished -->
        <li class='done'>Make a disclaimer</li>
        <li class='done'>Plan out world</li>
        <li class='nah'>Maybe use draco loader?</li>
        <li class='nah'>Clean up scaled elements in all visors</li>
        <li class='nah'>Missiles fill up on visor swap</li>
        <li class='nah'>Rework physics to use Physijs</li>
        <li class='done'>Research shadows</li>
        <li class='done'>Restructure objects as classes</li>
        <li class='done'>Scan visor results</li>
        <li class='done'>Pause animations and sounds when not rendering</li>
        <li class='done'>Finalize Thermal Ammo</li>
        <li class='done'>Complete Xray altimeter</li>
        <li class='done'>Complete Xray ammo and danger</li>
        <li class='done'>Finalize Thermal Danger</li>
        <li class='done'>Make seekers disappear on thermal and xray visors</li>
        <li class='done'>Seekers fade at edge of screen</li>
        <li class='done'>Fix lock on quaternion issue</li>
        <li class='done'>Add a flying targetable ball</li>
        <li class='done'>Selectors should flash before changing</li>
        <li class='done'>Add words to the selectors</li>
        <li class='done'>Combat ammo words</li>
        <li class='done'>Get beam and missile projectiles the right color</li>
        <li class='done'>Add words and details to the danger markers</li>
        <li class='done'>Get visor sounds working</li>
        <li class='done'>Combat Seeker should turn red</li>
    </ul>
</div>

<style>
    #instructions {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        background-color: hsla(200, 50%, 50%, 0.5);
        pointer-events: none;
        color: white;
        font-family: 'Metroid';
    }

    .must {
        color: hsl(177, 86%, 30%);
    }

    .nice {
        color: hsl(220, 79%, 68%);
    }

    .done {
        color: gray;
        text-decoration: line-through;
        opacity: 0.3;
    }

</style>