import * as THREE from 'three';
import * as CANNON from 'cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { wrap, randomFloat } from './math';

/* 
	Floater
*/

export class Floater {
	constructor(x, y, z) {
		const shape = new CANNON.Sphere(0.5);
		this.body = new CANNON.Body({
			type: CANNON.Body.KINEMATIC
		});
		this.body.addShape(shape);
		const geometry = new THREE.SphereGeometry(0.5, 10, 10);
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
		this.mesh = new THREE.Mesh(geometry, material);

		this.body.addEventListener('collide', this.handleCollision);
	}

	setPosition(x, y, z) {
		this.body.position.set(x, y, z);
		this.updateMesh();
	}

	handleCollision(event) {
		console.log(event);
	}

	updateMesh() {
		this.mesh.position.copy(this.body.position);
	}
}

/* 
	Metroid
*/
let metroidMesh;
const loader = new GLTFLoader();
loader.load(`Metroid.glb`, (glb) => {
    metroidMesh = glb.scene;
});

export class Metroid {
	constructor(scene, array) {
        this.object = new THREE.Group();

        this.updating = false;
		this.scene = scene;
		this.theta = 0;
		this.waverY = 0;
		this.waverX = 0;

		this.waverYSpeed = randomFloat(0.2, 0.6);
		this.waverXSpeed = randomFloat(0.2, 0.6);
		this.waverYAmp = randomFloat(0.2, 1);
		this.waverXAmp = randomFloat(0.2, 1);
		this.thetaStart = randomFloat(0, Math.PI * 2); // Radians
		this.radius = randomFloat(8, 16); // Distance Units
		this.thetaSpeed = randomFloat(0.8, 1.2); // Radians per second
		this.height = randomFloat(5, 20);

        this.mesh = metroidMesh;
        this.scene.add(this.mesh);
        array.push(this);
        this.updating = true;
        // array.push(this);
	}

	update(timeElapsed) {
        if (!this.updating) return;
		// Update theta
		this.theta += this.thetaSpeed * timeElapsed;
		this.theta = wrap(this.theta);

		// Set position
		const waverX = this.waverXAmp * Math.cos((performance.now() * this.waverXSpeed) / 100);
		const waverY = this.waverYAmp * Math.sin((performance.now() * this.waverYSpeed) / 100);
        
		const x = (this.radius + waverX) * Math.cos(this.theta);
		const z = this.radius * Math.sin(this.theta);
		this.mesh.position.set(x, this.height + waverY, z);
        // this.mesh.quaternion.setFromAxisAngle((0, 1, 0), this.theta + Math.PI/2);
	}
}
