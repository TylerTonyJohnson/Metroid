import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { currentVisor } from '../../stores';
import { VisorType } from '../../enums';
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

		// Set data
		this.setMeshArrays();
		// this.setStores();

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

			this.setMaterials();
			this.environment = new Environment(this.experience);
		});
	}

	/* 
		Setup Functions
	*/
	setMeshArrays() {
		this.lookableMeshes = [];
		this.shootableMeshes = [];
		this.targetableMeshes = [];
		this.scannableMeshes = [];
	}

	// setStores() {
	// 	currentVisor.subscribe((value) => {
	// 		switch (value) {
	// 			case VisorType.Combat:
	// 			case VisorType.Scan:
	// 				console.log('Kaka');
	// 				break;
	// 			case VisorType.Thermal:
	// 				console.log('doodie');
	// 				this.changeMaterials();
	// 				break;
	// 			case VisorType.Xray:
	// 				console.log('poopie');
	// 				break;
	// 		}
	// 	});
	// }

	setPhysicsWorld() {
		this.physicsWorld = new CANNON.World();
		this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);

		const solver = new CANNON.GSSolver();
		solver.iterations = 5;
		solver.tolerance = 0.1;
		this.physicsWorld.solver = new CANNON.SplitSolver(solver);
		this.physicsWorld.gravity.set(0, -6, 0);

		const defaultPhysicsMaterial = new CANNON.Material('default');
		this.defaultContactMaterial = new CANNON.ContactMaterial(
			defaultPhysicsMaterial,
			defaultPhysicsMaterial,
			{
				friction: 0,
				restitution: 0
			}
		);
		this.physicsWorld.defaultContactMaterial = this.defaultContactMaterial;
	}

	setMaterials() {
		/* 
			Combat Materials
		*/

		// Arm Cannon
		this.armCannonCombatMaterials = [];
		this.resources.items.armCannonGLB.scene.traverse((child) => {
			if (child.isMesh) this.armCannonCombatMaterials.push(child.material);
		});

		// Metroid
		this.metroidCombatMaterials = [];
		this.resources.items.metroidGLB.scene.traverse((child) => {
			if (child.isMesh) this.metroidCombatMaterials.push(child.material);
		});

		// Beta Metroid
		this.betaMetroidCombatMaterials = [];
		this.resources.items.betaMetroidGLB.scene.traverse((child) => {
			if (child.isMesh) this.betaMetroidCombatMaterials.push(child.material);
		});

		// Hangar
		this.hangarCombatMaterials = [];
		this.resources.items.hangarGLB.scene.traverse((child) => {
			if (child.isMesh) this.hangarCombatMaterials.push(child.material);
		});
		// Glass tube

		// Glass window

		/* 
			Thermal Materials
		*/
		this.thermalHotMaterial = new THREE.MeshMatcapMaterial({
			matcap: this.resources.items.powerShotTexture,
			// transparent: false,
			// depthWrite: false,
			// depthTest: false,

		});
		this.thermalColdMaterial = new THREE.MeshMatcapMaterial({
			matcap: this.resources.items.thermalColdTexture,
			
		});
	}

	setDebug() {
		this.debug.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld);
		// this.debugFolder = this.debug.gui.addFolder('Floor');
		// this.debugFolder.add(this.floorBody.position, 'y').min(-50).max(0).step(0.001);
	}

	/* 
	Actions
*/

	// changeMaterials() {
	// 	const resource = this.resources.items.powerShotTexture;
	// 	const material = new THREE.MeshMatcapMaterial({ matcap: resource });

	// 	this.scene.traverse(child => {
	// 		if (child.isMesh) {
	// 			child.material = material;
	// 		}
	// 	})
	// }

	/* 
		Update
	*/
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
