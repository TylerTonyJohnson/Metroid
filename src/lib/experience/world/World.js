import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import Environment from './Environment';
import Hangar from './Hangar';
import FloatCreature from './FloatCreature';
import BetaMetroid from './BetaMetroid';
import Metroid from './Metroid';
import Samus from '../Samus';

export default class World {
	constructor(experience) {
		this.experience = experience;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

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
			// Test mesh
			const testMesh = new THREE.Mesh(
				new THREE.BoxGeometry(1, 1, 1),
				new THREE.MeshPhysicalMaterial({
					// color: 'gray',
					transparent: true,
					roughnessMap: this.resources.items.dirtyGlassRoughness,
					opacity: 1,
					ior: 1.5,
					thickness: 1,
					transmission: 1
				})
			);
			this.scene.add(testMesh);

			// Setup
			this.samus = new Samus(this.experience);
			this.hangar = new Hangar(this.experience);
			this.floatCreature = new FloatCreature(this.experience);
			this.betaMetroid = new BetaMetroid(this.experience);
			this.metroid = new Metroid(this.experience);
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
		this.physicsWorld.gravity.set(0, -9.81, 0);

		const defaultPhysicsMaterial = new CANNON.Material('default');
		this.defaultContactMaterial = new CANNON.ContactMaterial(
			defaultPhysicsMaterial, 
			defaultPhysicsMaterial, {
				friction: 0.1,
				restitution: 0.7,
			}
		)
		this.physicsWorld.defaultContactMaterial = this.defaultContactMaterial;

		// Floor Plane
		const planeShape = new CANNON.Plane();
		this.floorBody = new CANNON.Body({ mass: 0 });
		this.floorBody.addShape(planeShape);
		this.floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		this.physicsWorld.addBody(this.floorBody);
	}

	setDebug() {
		this.debug.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld);
	}

	update() {
		this.physicsWorld.step(this.timestep, this.time.delta, 3);

		if (this.samus) this.samus.update();
		if (this.floatCreature) this.floatCreature.update();
		if (this.betaMetroid) this.betaMetroid.update();
	}
}
