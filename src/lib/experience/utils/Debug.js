import CannonDebugger from 'cannon-es-debugger';
import * as GUI from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class Debug {
    constructor() {
        this.isActive = window.location.hash === '#debug';

        // Setup 
        if(!this.isActive) return; 
            this.gui = new GUI.GUI({ closeFolders: true });
            this.stats = new Stats();
            this.cannonDebugger = null;
            document.body.appendChild(this.stats.dom);
    }

    update() {
        if (this.stats) this.stats.update();
        if (this.cannonDebugger) this.cannonDebugger.update();
    }
}