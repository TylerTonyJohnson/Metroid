import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import Environment from './Environment';
import Hangar from './Hangar';
import BetaMetroid from './BetaMetroid';
import Metroid from './Metroid';
import Samus from '../samus/Samus';
import MissilePickup from './MissilePickup';
import MissileExpansionPickup from './MissileExpansionPickup';
import DamagePickup from './DamagePickup';
import HealthPickup from './HealthPickup';
import EnergyTank from './EnergyTank';

export default class World {
	constructor(experience) {
		this.experience = experience;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

		// Set data
		this.setWorldObjectArrays();

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
			
			// Samus
			this.samus = new Samus(this.experience);
			
			// Metroids
			this.metroids = [];
			for (let i = 0; i < 5; i++) {
				const metroid = new Metroid(this.experience);
				this.metroids.push(metroid);
			}
			this.betaMetroid = new BetaMetroid(this.experience);

			// Hangar
			this.hangar = new Hangar(this.experience);

			// Damage ball
			const damagePickup = new DamagePickup(this);
			const healthPickup = new HealthPickup(this);
			const energyTank = new EnergyTank(this);
			const missilePickup = new MissilePickup(this);
			const missileExpansionPickup = new MissileExpansionPickup(this);

			// Environment
			this.setMaterials();
			this.environment = new Environment(this.experience);
		});
	}

	/* 
		Setup
	*/
	setWorldObjectArrays() {
		this.lookableMeshes = [];
		this.shootableMeshes = [];
		this.targetableMeshes = [];
		this.scannableMeshes = [];
		this.objectsToTrigger = [];
		this.bodiesToRemove = [];
	}

	setPhysicsWorld() {
		this.physicsWorld = new CANNON.World();
		this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);

		const solver = new CANNON.GSSolver();
		solver.iterations = 5;
		solver.tolerance = 0.1;
		// this.physicsWorld.solver = new CANNON.SplitSolver(solver);
		this.physicsWorld.gravity.set(0, -6, 0);

		const defaultPhysicsMaterial = new CANNON.Material('default');
		this.defaultContactMaterial = new CANNON.ContactMaterial(
			defaultPhysicsMaterial,
			defaultPhysicsMaterial,
			{
				friction: 0,
				restitution: 0,
				contactEquationStiffness: 1e9,
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
			if (child.isMesh) {
				this.metroidCombatMaterials.push(child.material);
			}
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
			matcap: this.resources.items.thermalHotTexture,
			fog: false,
			// transparent: false,
			// depthWrite: false,
			// depthTest: false,
		});
		this.thermalColdMaterial = new THREE.MeshMatcapMaterial({
			matcap: this.resources.items.thermalColdTexture
		});

		this.thermalGlassMaterial = new THREE.MeshMatcapMaterial({
			matcap: this.resources.items.thermalColdTexture,
			transparent: true,
			opacity: 0.3
		});

		/* 
			Xray Materials
		*/

		this.xrayTransparentMaterial = new THREE.MeshBasicMaterial({
			color: '#C9E8E8',
			transparent: true,
			opacity: 0.75,
			// depthWrite: false,
			depthTest: false,
			fog: false
		});

		this.xraySolidMaterial = new THREE.MeshBasicMaterial({
			color: '#333853'
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
	build() {
		
	}

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
		// Trigger collided bodies
		this.objectsToTrigger.forEach(object => {
			object.trigger();
		})
		this.objectsToTrigger = [];

		// Clear bodies
		this.bodiesToRemove.forEach(body => {
			this.physicsWorld.removeBody(body);
		});
		this.bodiesToRemove = [];
		
		// Update physics world
		this.physicsWorld.step(this.timestep, this.time.delta, 3);

		// Update meshes
		if (this.samus) this.samus.update();
		if (this.betaMetroid) this.betaMetroid.update();
		for (const metroid of this.metroids) {
			metroid.update();
		}
	}
}
