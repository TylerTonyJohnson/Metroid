import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { currentVisor } from '../../stores';
import { BodyGroup, VisorType } from '../../enums';

export default class Hangar {
	constructor(experience) {
		this.experience = experience;
		this.world = this.experience.world;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.debug = this.experience.debug;

		// Setup
		this.setStores();
		this.setModel();
		this.setBodies();
	}

	/* 
		Setup
	*/

	setStores() {
		currentVisor.subscribe((value) => {
            if (!this.model) return;

            // Set material based on visor
            switch (value) {
                case VisorType.Combat:
                case VisorType.Scan:
                    this.setHangarMaterials(this.world.hangarCombatMaterials);
					this.setTubeMaterial(this.tubeCombatMaterial);
					this.setWindowMaterial(this.windowCombatMaterial);
                    break;
                case VisorType.Thermal:
                    this.setHangarMaterial(this.world.thermalColdMaterial);
					this.setTubeMaterial(this.world.thermalGlassMaterial);
					this.setWindowMaterial(this.world.thermalGlassMaterial);
                    break;
                case VisorType.Xray:
					this.setHangarMaterial(this.world.xraySolidMaterial);
					this.setTubeMaterial(this.world.thermalGlassMaterial);
					this.setWindowMaterial(this.world.thermalGlassMaterial);
                    break;
            }
		});
	}

	setModel() {
		this.resource = this.resources.items.hangarGLB;
		this.model = this.resource.scene;

		// Config
		this.model.scale.set(12, 12, 12);
		this.model.rotation.y = -Math.PI / 2;

		this.scene.add(this.model);
		// this.world.shootableMeshes.push(this.model);
		// this.world.lookableMeshes.push(this.model);

		// this.model.traverse((child) => {
		// 	if (child.isMesh) {
		// 		this.world.lookableMeshes.push(child);
		// 		// child.castShadow = true;
		//         // child.receiveShadow = true;
		// 	}
		// });

		// Glass Tube
		const tubeGeo = new THREE.CylinderGeometry(6, 6, 20, 24);
		this.tubeCombatMaterial = new THREE.MeshPhysicalMaterial({
			color: 'gray',
			// side: THREE.DoubleSide,
			transparent: true,
			transmission: 1,
			roughnessMap: this.resources.items.dirtyGlassRoughness,
			opacity: 1,
			reflectivity: 0.5,
			roughness: 0.5,
			ior: 1.5,
			thickness: 0.2,
			// depthWrite: false,
			// depthTest: false,
		});
		this.tubeMesh = new THREE.Mesh(tubeGeo, this.tubeCombatMaterial);
		this.tubeMesh.position.set(0, 0, 0);
		this.tubeMesh.rotation.y = Math.PI / 12;
		// tubeMesh.renderOrder = 1;
		this.scene.add(this.tubeMesh);
		this.world.lookableMeshes.push(this.tubeMesh);
		this.world.shootableMeshes.push(this.tubeMesh);

		// Window
		const windowGeo = new THREE.BoxGeometry(1, 26, 50);
		this.windowCombatMaterial = new THREE.MeshPhysicalMaterial({
			// color: 'gray',
			map: this.resources.items.frostedGlassColor,
			// normalMap: this.resources.items.frostedGlassNormal,
			// roughnessMap: this.resources.items.frostedGlassRoughness,
			// aoMap: this.resources.items.frostedGlassAmbientOcclusion,
			// displacementMap: this.resources.items.frostedGlassHeight,
			transparent: true,
			transmission: 1,
			opacity: 1,
			// reflectivity: 0,
			roughness: 0.2,
			ior: 1.5,
			thickness: 0.2,
		});
		this.windowMesh = new THREE.Mesh(windowGeo, this.windowCombatMaterial);
		this.windowMesh.position.set(58, 3, 0);
		this.scene.add(this.windowMesh);
		this.world.lookableMeshes.push(this.windowMesh);
		this.world.shootableMeshes.push(this.windowMesh);
	}

	setBodies() {
		this.body = new CANNON.Body({ type: CANNON.Body.STATIC });
		this.body.collisionFilterGroup = BodyGroup.Walls;
		this.body.collisionFilterMask = BodyGroup.Samus;

		// Floors
		this.addBox(new CANNON.Vec3(64, 1, 64), new CANNON.Vec3(-9, -9, 0));
		this.addBox(new CANNON.Vec3(36, 1, 18), new CANNON.Vec3(41, -9.1, 0));
		this.addBox(new CANNON.Vec3(36, 1, 12), new CANNON.Vec3(41, -9, 14.75));
		this.addBox(new CANNON.Vec3(36, 1, 12), new CANNON.Vec3(41, -9, -14.75));
		this.addCylinder(new CANNON.Vec3(24.6, 4, 24.6), new CANNON.Vec3(0, -9, 0));

		// Stairs
		this.addBox(new CANNON.Vec3(7.2, 1, 5), new CANNON.Vec3(27.6, -8.625, 0), new CANNON.Vec3(0, 0, -0.34));

		// Walls
		this.addBox(new CANNON.Vec3(44, 12, 1), new CANNON.Vec3(37, -2, -19));
		this.addBox(new CANNON.Vec3(44, 12, 1), new CANNON.Vec3(37, -2, 19));
		
		const radius = 24;
		const theta = Math.PI / 12;
		const thetaOffset = Math.PI / 3;
		for (let i = 0; i < 17; i++) {
			const x = radius * Math.cos(theta * i + thetaOffset);
			const y = -2;
			const z = radius * Math.sin(theta * i + thetaOffset);
			const rotation = -(theta * i + thetaOffset);
			this.addBox(new CANNON.Vec3(1, 12, 8), new CANNON.Vec3(x, y, z), new CANNON.Vec3(0, rotation, 0));
		}

		// Glass
		this.addCylinder(new CANNON.Vec3(18, 24, 18), new CANNON.Vec3(0, 4, 0));
		this.addBox(new CANNON.Vec3(1, 26, 37), new CANNON.Vec3(58, 3, 0));

		// Ceiling
		this.addBox(new CANNON.Vec3(128, 1, 64), new CANNON.Vec3(0, 3.5, 0));

		// Add to scene
		this.experience.world.physicsWorld.addBody(this.body);
	}

	addBox(size, position, rotation) {
		
		const newShape = new CANNON.Box(size.scale(1 / 2));
		let quaternion = new CANNON.Quaternion();
		if (rotation) quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
		this.body.addShape(newShape, position, quaternion);
	}

	addCylinder(size, position, rotation) {
		const newShape = new CANNON.Cylinder(size.x, size.z, size.y, 24);
		const quaternion = new CANNON.Quaternion();
		if (rotation) quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
		this.body.addShape(newShape, position, quaternion);
	}

	/* 
		Actions
	*/
	setHangarMaterials(materials) {
        let i = 0;
        this.model.traverse(child => {
            if (child.isMesh) {
                child.material = materials[i];
                i++;
            }
        })
    }

    setHangarMaterial(material) {
        this.model.traverse(child => {
            if (child.isMesh) {
                child.material = material;
            }
        })
    }

	setTubeMaterial(material) {
		this.tubeMesh.material = material;
	}
	setWindowMaterial(material) {
		this.windowMesh.material = material;
	}
}
