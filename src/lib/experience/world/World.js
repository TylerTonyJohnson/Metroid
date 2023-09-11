import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import Environment from './Environment';
import Hangar from './Hangar';
import BetaMetroid from './BetaMetroid';
import Metroid from './Metroid';
import Samus from '../samus/Samus';
import MissileAmmoPickup from './MissileAmmoPickup';
import MissileExpansionPickup from './MissileExpansionPickup';
import DamagePickup from './DamagePickup';
import HealthPickup from './HealthPickup';
import EnergyTank from './EnergyTank';
import DamageFire from './DamageFire';

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
			// Materials
			this.setMaterials();
			this.build();
		});
	}

	/* 
		Setup
	*/
	setWorldObjectArrays() {
		// Sort arrays
		this.lookableMeshes = [];
		this.shootableMeshes = [];
		this.targetableMeshes = [];
		this.scannableMeshes = [];
		this.dangerMeshes = [];

		// Management
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
				contactEquationStiffness: 1e9
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

		// Missile Expansion
		this.missileExpansionCombatMaterials = [];
		this.resources.items.missileExpansionGLB.scene.traverse((child) => {
			if (child.isMesh) this.missileExpansionCombatMaterials.push(child.material);
		});

		// Missile ammo
		this.missileAmmoCombatMaterials = [];
		this.resources.items.missileAmmoGLB.scene.traverse((child) => {
			if (child.isMesh) this.missileAmmoCombatMaterials.push(child.material);
		});

		// Energy tank
		this.energyTankCombatMaterials = [];
		this.resources.items.energyTankGLB.scene.traverse((child) => {
			if (child.isMesh) this.energyTankCombatMaterials.push(child.material);
		});

		// Health pickup
		this.healthCombatMaterials = [];
		this.resources.items.healthGLB.scene.traverse((child) => {
			if (child.isMesh) this.healthCombatMaterials.push(child.material);
		});

		/* 
			Thermal Materials
		*/
		this.thermalHotMaterial = new THREE.MeshMatcapMaterial({
			matcap: this.resources.items.thermalHotTexture,
			fog: false
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
		// Samus
		this.samus = new Samus(this.experience);

		// Metroids
		this.metroids = [];
		for (let i = 0; i < 10; i++) {
			const metroid = new Metroid(this.experience);
			this.metroids.push(metroid);
		}
		this.betaMetroid = new BetaMetroid(this.experience);

		// Hangar
		this.hangar = new Hangar(this.experience);

		// Pickups
		// this.spawnDamagePickup(new THREE.Vector3(27, -7, 13));
		this.spawnDamageFire(new THREE.Vector3(27, -8.5, 13));
		this.spawnHealthPickup(new THREE.Vector3(36, -7, 13));
		this.spawnHealthPickup(new THREE.Vector3(45, -7, 13));
		this.spawnEnergyTankPickup(new THREE.Vector3(54, -7, 13));
		this.spawnMissileAmmoPickup(new THREE.Vector3(27, -7, -13));
		this.spawnMissileExpansionPickup(new THREE.Vector3(36, -7, -13));
		

		// Environment
		this.environment = new Environment(this.experience);
	}

	spawnDamagePickup(position) {
		const damagePickup = new DamagePickup(this, position);
	}
	spawnDamageFire(position) {
		const damageFire = new DamageFire(this, position);
	}
	spawnHealthPickup(position) {
		const healthPickup = new HealthPickup(this, position);
	}
	spawnEnergyTankPickup(position) {
		const energyTankPickup = new EnergyTank(this, position);
	}
	spawnMissileAmmoPickup(position) {
		const missileAmmoPickup = new MissileAmmoPickup(this, position);
	}
	spawnMissileExpansionPickup(position) {
		const missileExpansionPickup = new MissileExpansionPickup(this, position);
	}

	/* 
		Update
	*/
	update() {
		// Trigger collided bodies
		this.objectsToTrigger.forEach((object) => {
			object.trigger();
		});
		this.objectsToTrigger = [];

		// Clear bodies
		this.bodiesToRemove.forEach((body) => {
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
