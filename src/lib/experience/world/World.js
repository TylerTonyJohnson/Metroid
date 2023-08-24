import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import Environment from './Environment';
import Hangar from './Hangar';
import BetaMetroid from './BetaMetroid';
import Metroid from './Metroid';
import Samus from './Samus';

export default class World {
	constructor(experience) {
		this.experience = experience;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

		// Mesh Arrays
		this.lookableMeshes = [];
		this.shootableMeshes = [];
		this.targetableMeshes = [];
		this.scannableMeshes = [];

		// Create render scene
		this.scene = new THREE.Scene();

		// Create physics world
		this.timestep = 1 / 60;
		this.setPhysicsWorld();

		// Set debug
		if (this.debug.isActive) {
			this.setDebug();
		}

		// Wait for resources to load
		this.resources = this.experience.resources;
		this.resources.addEventListener('loaded', () => {

			// Setup
			this.samus = new Samus(this.experience);
			// this.floatCreature = new FloatCreature(this.experience);
			this.metroids = [];
			for (let i = 0; i < 20; i++) {
				const metroid = new Metroid(this.experience);
				this.metroids.push(metroid);
			}
			this.betaMetroid = new BetaMetroid(this.experience);
			this.hangar = new Hangar(this.experience);
			this.environment = new Environment(this.experience);
		});
	}

	setPhysicsWorld() {
		this.physicsWorld = new CANNON.World();
		this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
		// this.physicsWorld.allowSleep = true;

		const solver = new CANNON.GSSolver();
		solver.iterations = 5;
		solver.tolerance = 0.1;
		this.physicsWorld.solver = new CANNON.SplitSolver(solver);
		this.physicsWorld.gravity.set(0, -6, 0);

		const defaultPhysicsMaterial = new CANNON.Material('default');
		this.defaultContactMaterial = new CANNON.ContactMaterial(
			defaultPhysicsMaterial, 
			defaultPhysicsMaterial, {
				friction: 0,
				restitution: 0,
			}
		)
		this.physicsWorld.defaultContactMaterial = this.defaultContactMaterial;
	}

	setDebug() {
		this.debug.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld);
		// this.debugFolder = this.debug.gui.addFolder('Floor');
		// this.debugFolder.add(this.floorBody.position, 'y').min(-50).max(0).step(0.001);
	}

	update() {
		this.physicsWorld.step(this.timestep, this.time.delta, 3);

		if (this.samus) this.samus.update();
		if (this.floatCreature) this.floatCreature.update();
		if (this.betaMetroid) this.betaMetroid.update();
		for (const metroid of this.metroids) {
			metroid.update();
		}
	}
}
