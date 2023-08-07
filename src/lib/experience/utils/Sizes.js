import * as THREE from 'three';

export default class Sizes extends THREE.EventDispatcher {

    constructor() {
        super();

        // Setup
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Resize event
        window.onresize = () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            this.dispatchEvent({ type: 'resize', doob: 'schmeef'});
        }
    }
}