import * as THREE from 'three';
import { closestSeekerPosition } from '../../stores';

export default class Seeker {
	constructor(samus) {
		// References
		this.samus = samus;
		this.world = this.samus.world;
		this.scene = this.samus.scene;
		this.camera = this.samus.camera;
		this.seekableMeshes = this.world.targetableMeshes;

		// Setup
		this.visibleMeshes = [];
        this.projectedPositions = [];
		this.closestMesh = null;
        this.closestPosition = null;
		this.setMesh();
		this.setFrustum();
		// this.setRaycaster();
	}

	/* 
        Setup
    */

	setMesh() {
		const geometry = new THREE.SphereGeometry(1);
		const material = new THREE.MeshBasicMaterial({
			color: 'red',
			wireframe: true
		});

		this.mesh = new THREE.Mesh(geometry, material);
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

		// this.getVisibleMeshes();

		// if (this.visibleMeshes.length > 0) this.getProjectedPositions();

		// // Set seeker position
		// this.mesh.position.copy(closestMesh.position);

		// // Send seeker position to store
		// const projectedVector = this.mesh.position.clone().project(this.camera);
		// closestSeekerPosition.set(projectedVector);

		// Cleanup
		// this.visibleMeshes = [];
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
		let closestPosition = Infinity;
		for (const mesh of this.visibleMeshes) {

            // Keep track of this mesh's position
			const projectedMeshPosition = mesh.position.clone().project(this.camera);
            this.projectedPositions.push(projectedMeshPosition);

            // Check if this mesh is the closest to the center
			const distanceFromCenter = Math.sqrt(
				Math.pow(projectedMeshPosition.x, 2) + Math.pow(projectedMeshPosition.y, 2)
			);

			if (distanceFromCenter < closestPosition) {
				closestMesh = mesh;
				closestPosition = distanceFromCenter;
			}
		}
        this.closestMesh = closestMesh;
        this.closestPosition = closestPosition;
    }
}
