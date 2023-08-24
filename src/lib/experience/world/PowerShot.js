import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class PowerShot {
	static fireVelocity = 20;

	constructor(armCannon) {
		// References
		this.armCannon = armCannon;
		this.samus = this.armCannon.samus;
		this.scene = this.samus.scene;
        this.world = this.samus.world;
		this.physicsWorld = this.samus.world.physicsWorld;
		this.time = this.samus.experience.time;

		// Config
		this.mesh = this.armCannon.powerShotMesh.clone();
        this.mesh.quaternion.copy(this.samus.group.quaternion);
		
        // Tick event
		this.time.addEventListener('tick', (event) => {
			this.update();
		});

		// Spawn
		this.setBody();
		this.spawn();
        this.setRay();
	}

	setBody() {
		// Generate
		const powerShotShape = new CANNON.Sphere(0.2);
		this.body = new CANNON.Body({ type: CANNON.Body.KINEMATIC });
		this.body.addShape(powerShotShape);

		// Configure position  and direction
		this.spawnPosition = this.samus.group.localToWorld(new THREE.Vector3(-0.2, -0.2, 1));
		this.body.position.copy(this.spawnPosition);
	}

	spawn() {
		// Set position
		this.mesh.position.copy(this.spawnPosition);

		// Set speed
		this.spawnDirection = new THREE.Vector3();
		this.samus.group.getWorldDirection(this.spawnDirection);

		// Add to scene
		this.scene.add(this.mesh);
		this.physicsWorld.addBody(this.body);

        // this.distanceThreshold = 10;
	}

    setRay() {
        this.rayCaster = new THREE.Raycaster(
            this.spawnPosition,
            this.spawnDirection,
            0,
            100
        );
    }

    shoot() {
        // Set velocity to shoot velocity
        this.body.velocity.set(
            this.spawnDirection.x * PowerShot.fireVelocity,
            this.spawnDirection.y * PowerShot.fireVelocity,
            this.spawnDirection.z * PowerShot.fireVelocity
        );

        // Set distance at which to delete the shot
        const intersects = this.rayCaster.intersectObjects(this.world.shootableMeshes, false);
        if (intersects.length) {
            this.distanceThreshold = intersects[0].distance;
        } else {
            this.distanceThreshold = 100;
        }

        // Play the sound
    }

	update() {
		this.mesh.position.copy(this.body.position);
        
        // Get distance from start
        const distance = this.mesh.position.distanceTo(this.spawnPosition);
        if (distance > this.distanceThreshold) this.destroy();
	}

    destroy() {
        this.scene.remove(this.mesh);
        this.physicsWorld.removeBody(this.body);
    }
}
