<div id='instructions'>
    <h1 class='title'>THINGS TO DO</h1>
    <ul id='words'>
        <li>Clean up scaled elements in all visors</li>
        <li>Scan visor results</li>
        <li>Fix lock on quaternion issue</li>
        <li>Add words to the selectors</li>
        <li>Complete Xray altimeter</li>
        <li>Complete Xray ammo and danger</li>
        <li>Shaders</li>
        <li>Standardize and centralize colors and styles into root</li>
        <li>Selectors should flash before changing</li>
        <li>Seekers fade at edge of screen</li>
        <li>Missiles fill up on visor swap</li>
        <li>Go through static folder and clean things up</li>
        <li>Put component files in nice folders</li>
        <li>Make sounds fade out as they stop playing - Tween Library?</li>
        <li>Make seekers disappear on thermal and xray visors</li>
        <li>Make an instructions page</li>
        <li>Make a "controls" display</li>
        <li>Make a disclaimer</li>
        <li>Make the seeker list only grab what's targetable (distance, scan)</li>
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

    .done {
        text-decoration: line-through;
        order: 100;
    }

</style>