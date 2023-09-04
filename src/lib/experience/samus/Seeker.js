import * as THREE from 'three';
import { seekerPositions, closestSeekerPosition, isLockable, currentVisor } from '../../stores';
import { VisorType } from '../../enums';

export default class Seeker {
	constructor(samus) {
		// References
		this.samus = samus;
		this.world = this.samus.world;
		this.time = this.world.time;
		this.scene = this.samus.scene;
		this.camera = this.samus.camera;
		// this.seekableMeshes = this.world.targetableMeshes;

		// Setup
		this.setStores();
		this.setSeekerMeshes();
		this.setMesh();
		this.setFrustum();
		// this.setRaycaster();
	}

	/* 
        Setup
    */
	setStores() {
		currentVisor.subscribe((value) => {
			this.$currentVisor = value;
			switch (this.$currentVisor) {
				case VisorType.Combat:
				case VisorType.Thermal:
				case VisorType.Xray:
					this.seekableMeshes = this.world.targetableMeshes;
					break;
				case VisorType.Scan:
					this.seekableMeshes = this.world.scannableMeshes;
					break;
			}
		});
	}

	setSeekerMeshes() {
		this.visibleMeshes = [];
		this.projectedPositions = [];
		this.closestMesh = null;
		this.closestPosition = null;
		this.lerpAlpha = 0.1;
	}

	setMesh() {
		const geometry = new THREE.SphereGeometry(1);
		const material = new THREE.MeshBasicMaterial({
			color: 'red',
			wireframe: true
		});

		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.visible = false;
		this.scene.add(this.mesh);
	}

	setFrustum() {
		this.camera.updateMatrix();
		this.camera.updateMatrixWorld();
		this.frustum = new THREE.Frustum();
		this.projectionMatrix = new THREE.Matrix4();
		this.projectionMatrix.multiplyMatrices(
			this.camera.projectionMatrix,
			this.camera.matrixWorldInverse
		);
		this.frustum.setFromProjectionMatrix(this.projectionMatrix);
	}

	// setRaycaster() {
	//     this.cameraVector = new THREE.Vector2();
	//     this.raycaster = new THREE.Raycaster();
	// }

	/* 
        Update
    */
	update() {
		// Get visible meshes
		this.getVisibleMeshes();

		// If there are none, reset
		if (this.visibleMeshes.length < 1) {
			this.resetSeekerMeshes();
			// return;
		}

		// If there are visible meshes, find out where they are, find closest
		this.getProjectedPositions();

		// If seeker mesh is the same or different, do something
		if (this.closestMesh === null) {
			this.mesh.position.lerp(
				this.samus.group.localToWorld(new THREE.Vector3(0, 0, 10)),
				this.lerpAlpha
			);
		} else {
			this.mesh.position.lerp(this.closestMesh.position, this.lerpAlpha);
		}

		// Send seeker position to store
		seekerPositions.set(this.projectedPositions);
		const projectedLerp = this.mesh.position.clone().project(this.camera);
		closestSeekerPosition.set(projectedLerp);
		isLockable.set(!!this.closestMesh);

		// Cleanup
		this.visibleMeshes = [];
		this.projectedPositions = [];
	}

	getVisibleMeshes() {
		// Setup frustrum
		this.projectionMatrix.multiplyMatrices(
			this.camera.projectionMatrix,
			this.camera.matrixWorldInverse
		);
		this.frustum.setFromProjectionMatrix(this.projectionMatrix);

		// Check if this mesh is in the view frustum
		for (const mesh of this.seekableMeshes) {
			if (this.frustum.containsPoint(mesh.position)) this.visibleMeshes.push(mesh);
		}
	}

	getProjectedPositions() {
		let closestMesh = null;
		let closestPosition = null;
		let closestDistance = Infinity;
		for (const mesh of this.visibleMeshes) {
			// Keep track of this mesh's position
			const projectedMeshPosition = mesh.position.clone().project(this.camera);
			this.projectedPositions.push(projectedMeshPosition);

			// Check if this mesh is the closest to the center
			const distanceFromCenter = Math.sqrt(
				Math.pow(projectedMeshPosition.x, 2) + Math.pow(projectedMeshPosition.y, 2)
			);

			if (distanceFromCenter < closestDistance) {
				closestMesh = mesh;
				closestPosition = projectedMeshPosition;
				closestDistance = distanceFromCenter;
			}
		}
		this.closestMesh = closestMesh;
		this.closestPosition = closestPosition;
	}

	resetSeekerMeshes() {
		this.closestPosition = null;
		this.projectedPositions = [];
		// closestSeekerPosition.set({ x: 0, y: 0 });
	}
}
