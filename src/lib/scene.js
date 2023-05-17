import * as THREE from 'three';
import * as CANNON from 'cannon';
import { PointerLockControlsCannon } from './controls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
	controls as $controls,
	currentVisor as visor,
	currentHealth as health,
	maxHealth,
	lookDistance,
	currentBeam as beam,
	isZoomed as _isZoomed,
	seekerPosition
} from './stores';
import { BeamType, VisorType } from './enums';
import { Vector3 } from 'three';

// THREE variables
let camera, frustum, scene, renderer, raycaster;
let material;
let lookObject;

// CANNON variables
let world;
let controls;
const timeStep = 1 / 60;
let lastCallTime = performance.now();
let sphereShape, sphereBody;
let physicsMaterial;
const boxes = [];
const boxMeshes = [];
const balls = [];
const ballMeshes = [];
const sceneMeshes = [];

let seekerObject;
let canvas;
let sound, ambient;
let currentVisor, currentHealth, currentBeam, isZoomed;

// SETUP

export function setup(element) {
	canvas = element;
	visor.subscribe((value) => {
		currentVisor = value;
	});

	health.subscribe((value) => {
		currentHealth = value;
	});

	beam.subscribe((value) => {
		currentBeam = value;
	});

	_isZoomed.subscribe((value) => {
		isZoomed = value;
	});

	window.alert = function () {};

	initThree(element);
	initCannon();
	initPointerLock(element);
	animate();
}

// METHODS

function initThree(element) {
	// Camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000);

	// Sound
	const listener = new THREE.AudioListener();
	camera.add(listener);
	sound = new THREE.Audio(listener);

	const audioLoader = new THREE.AudioLoader();
	audioLoader.load('laser.wav', function (buffer) {
		sound.setBuffer(buffer);
		sound.setVolume(0.5);
	});

	ambient = new THREE.Audio(listener);
	audioLoader.load('ambient.mp3', function (buffer) {
		ambient.setBuffer(buffer);
		ambient.setLoop(true);
		ambient.setVolume(0.5);
		// ambient.play();
	});

	// Scene
	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog(0x000000, 0, 500);
	// scene.background = new THREE.Color(0x111111);

	// Renderer
	renderer = new THREE.WebGLRenderer({ antialias: true, canvas: element });
	renderer.setSize(window.innerWidth, window.innerHeight);
	// renderer.setClearColor(scene.fog.color);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// Raycaster
	raycaster = new THREE.Raycaster();

	// Generic material
	material = new THREE.MeshStandardMaterial({
		color: 0x00ff00,
		metalness: 0.13
	});

	// Floor
	const floorGeometry = new THREE.PlaneGeometry(300, 300, 100, 100);
	floorGeometry.rotateX(-Math.PI / 2);
	const floor = new THREE.Mesh(floorGeometry, material);
	floor.receiveShadow = true;
	// scene.add(floor);
	// sceneMeshes.push(floor);

	// Lighting
	const directionalLight = new THREE.DirectionalLight(0x9090aa);
	directionalLight.position.set(-10, 10, -10).normalize();
	// scene.add(directionalLight);

	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
	hemisphereLight.position.set(1, 1, 1);
	// scene.add(hemisphereLight);

	const spotlight = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1);
	spotlight.position.set(10, 30, 20);
	spotlight.target.position.set(0, 0, 0);

	spotlight.castShadow = true;

	spotlight.shadow.camera.near = 10;
	spotlight.shadow.camera.far = 100;
	spotlight.shadow.camera.fov = 30;

	// spotlight.shadow.bias = -0.0001
	spotlight.shadow.mapSize.width = 2048;
	spotlight.shadow.mapSize.height = 2048;

	scene.add(spotlight);

	const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
	scene.add(light);

	// SKY
	let materialArray = [];
	let texture_ft = new THREE.TextureLoader().load('purple_skybox/front.png');
	let texture_bk = new THREE.TextureLoader().load('purple_skybox/back.png');
	let texture_up = new THREE.TextureLoader().load('purple_skybox/top.png');
	let texture_dn = new THREE.TextureLoader().load('purple_skybox/bottom.png');
	let texture_rt = new THREE.TextureLoader().load('purple_skybox/left.png');
	let texture_lf = new THREE.TextureLoader().load('purple_skybox/right.png');

	materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
	materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
	materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
	materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
	materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
	materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

	for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

	let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
	let skybox = new THREE.Mesh(skyboxGeo, materialArray);
	scene.add(skybox);

	// Cleanup
	window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function initCannon() {
	world = new CANNON.World();

	world.defaultContactMaterial.contactEquationStiffness = 1e9;
	world.defaultContactMaterial.contactEquationRelaxation = 4;

	const solver = new CANNON.GSSolver();
	solver.iterations = 7;
	solver.tolerance = 0.1;
	world.solver = new CANNON.SplitSolver(solver);

	world.gravity.set(0, -32.2, 0);

	// Create slippery material
	physicsMaterial = new CANNON.Material('physics');
	const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
		friction: 0,
		restitution: 0.3
	});

	// Add contact materials to world
	world.addContactMaterial(physics_physics);

	// Create user collision sphere
	const radius = 1.3;
	sphereShape = new CANNON.Sphere(radius);
	sphereBody = new CANNON.Body({ mass: 5, material: physicsMaterial });
	sphereBody.addShape(sphereShape);
	sphereBody.position.set(0, 5, 20);
	sphereBody.linearDamping = 0.9;
	world.addBody(sphereBody);

	// Create ground plane
	const groundShape = new CANNON.Plane();
	const groundBody = new CANNON.Body({ mass: 0, material: physicsMaterial });
	groundBody.addShape(groundShape);
	groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
	world.addBody(groundBody);

	// Add boxes in cannon and three
	const halfExtents = new CANNON.Vec3(1, 1, 1);
	const boxShape = new CANNON.Box(halfExtents);
	const boxGeometry = new THREE.BoxGeometry(
		halfExtents.x * 2,
		halfExtents.y * 2,
		halfExtents.z * 2
	);

	for (let i = 0; i < 7; i++) {
		const boxBody = new CANNON.Body({ mass: 5 });
		boxBody.addShape(boxShape);
		const boxMesh = new THREE.Mesh(
			boxGeometry,
			new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
		);

		const x = (Math.random() - 0.5) * 20;
		const y = (Math.random() - 0.5) * 1 + 1;
		const z = (Math.random() - 0.5) * 20;

		boxBody.position.set(x, y, z);
		boxMesh.position.copy(boxBody.position);

		boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;

		world.addBody(boxBody);
		scene.add(boxMesh);
		boxes.push(boxBody);
		sceneMeshes.push(boxMesh);
	}

	seekerObject = sceneMeshes[0];
	seekerObject.geometry.computeBoundingBox();

	// Pickup cylinders
	// const cylinderShape = new CANNON.Cylinder(0.25, 0.75, 1, 10);
	// const cylinderGeometry = new THREE.CylinderGeometry(0.25, 0.5, 1, 10);
	// const cylinderMatUp = new THREE.MeshStandardMaterial({ emissive: 0x00ff00 });

	// for (let i = 0; i < 7; i++) {
	// 	const pickupBody = new CANNON.Body({ mass: 0 });
	// 	pickupBody.addShape(cylinderShape);
	// 	const pickupMesh = new THREE.Mesh(cylinderGeometry, cylinderMatUp);

	// 	const x = (Math.random() - 0.5) * 40;
	// 	const y = 1;
	// 	const z = (Math.random() - 0.5) * 40;

	// 	pickupBody.position.set(x, y, z);
	// 	pickupMesh.position.copy(pickupBody.position);

	// 	pickupMesh.castShadow = true;
	// 	// pickupMesh.receiveShadow = true;

	// 	world.addBody(pickupBody);
	// 	scene.add(pickupMesh);
	// 	boxes.push(pickupBody);
	// 	sceneMeshes.push(pickupMesh);

	// 	pickupBody.addEventListener('collide', pickupHealth);
	// }

	// const cylinderMatDown = new THREE.MeshStandardMaterial({ emissive: 0xff0000 });

	// for (let i = 0; i < 7; i++) {
	// 	const pickupBody = new CANNON.Body({ mass: 0 });
	// 	pickupBody.addShape(cylinderShape);
	// 	const pickupMesh = new THREE.Mesh(cylinderGeometry, cylinderMatDown);

	// 	const x = (Math.random() - 0.5) * 40;
	// 	const y = 1;
	// 	const z = (Math.random() - 0.5) * 40;

	// 	pickupBody.position.set(x, y, z);
	// 	pickupMesh.position.copy(pickupBody.position);

	// 	pickupMesh.castShadow = true;
	// 	// pickupMesh.receiveShadow = true;

	// 	world.addBody(pickupBody);
	// 	scene.add(pickupMesh);
	// 	boxes.push(pickupBody);
	// 	sceneMeshes.push(pickupMesh);

	// 	pickupBody.addEventListener('collide', pickupDamage);
	// }

	// Stars
	// const starGeo = new THREE.SphereGeometry(0.1, 24, 24);
	// const starMat = new THREE.MeshStandardMaterial({ color: 0xffffaa, emissive: 0xffffff });

	// for (let i = 0; i < 1000; i++) {
	// 	const star = new THREE.Mesh(starGeo, starMat);

	// 	const [x, y, z] = Array(3)
	// 		.fill()
	// 		.map(() => THREE.MathUtils.randFloatSpread(100));

	// 	star.position.set(x, y, z);
	// 	scene.add(star);
	// }

	// Sphere
	// const testRad = 2;
	// const testGeo = new THREE.SphereGeometry(testRad, 24, 24);
	// const testMat = new THREE.MeshStandardMaterial({ color: 'magenta'});
	// const testMesh = new THREE.Mesh(testGeo, testMat);

	// const testShape = new CANNON.Sphere(testRad);
	// const testBody = new CANNON.Body({ mass: 0, material: physicsMaterial });
	// testBody.addShape(sphereShape);
	// testBody.position.set(0, 0, 0);
	// // sphereBody.linearDamping = 0.9;
	// world.addBody(testBody);

	// Girl

	const loader = new GLTFLoader();

	// loader.load(`00_exterior_docking_hangar.glb`, (glb) => {
	// 	const content = glb.scene;
	// 	content.rotation.y = Math.PI;
	// 	content.position.set(-94, 0, -220);
	// 	scene.add(content);
	// });

	// loader.load(`beta_metroid.glb`, (glb) => {
	// 	const content = glb.scene;
	// 	content.position.set(5, 1, 5);
	// 	scene.add(content);
	// });

	// loader.load(`hallway.glb`, (glb) => {
	// 	const content = glb.scene;
	// 	// content.scale.set(0.2,0.2,0.2);
	// 	content.position.set(0, -2, 0);
	// 	scene.add(content);
	// });

	loader.load(`plasma_beam.glb`, (glb) => {
		const gltf = glb.scene;
		camera.add(gltf);
		gltf.position.set(0.1, 0, -0.5);
		gltf.rotation.set(0.1, Math.PI, 1);
		// gltf.quaternion.copy(camera.quaternion);
	});

	// SHOOTING
	const shootVelocity = 100;
	const ballShape = new CANNON.Sphere(0.2);
	const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
	const powerBeamMaterial = new THREE.MeshBasicMaterial({ color: '#FFB508' });
	const waveBeamMaterial = new THREE.MeshBasicMaterial({ color: '#9C84FE' });
	const IceBeamMaterial = new THREE.MeshBasicMaterial({ color: '#5AE7F8' });
	const PlasmaBeamMaterial = new THREE.MeshBasicMaterial({ color: '#FF4A49' });

	function getShotDirection() {
		const vector = new THREE.Vector3(0, 0, 1);
		vector.unproject(camera);
		const ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize());
		return ray.direction;
	}

	window.addEventListener('mousedown', handlePointerDown);
	window.addEventListener('mouseup', handlePointerUp);

	function handlePointerDown(event) {
		switch (event.which) {
			case 1:
				shoot(event);
				break;
			case 2:
				break;
			case 3:
				zoom(2);
				break;
		}
	}

	function handlePointerUp(event) {
		switch (event.which) {
			case 1:
				break;
			case 2:
				break;
			case 3:
				zoom(1);
				break;
		}
	}

	function shoot(event) {
		if (!controls.enabled) {
			return;
		}

		const ballBody = new CANNON.Body({ type: 4 });
		ballBody.addShape(ballShape);
		let beamMaterial;

		switch (currentBeam) {
			case BeamType.Power:
				beamMaterial = powerBeamMaterial;
				sound.detune = 0;
				break;
			case BeamType.Wave:
				beamMaterial = waveBeamMaterial;
				sound.detune = -1200;
				break;
			case BeamType.Ice:
				beamMaterial = IceBeamMaterial;
				sound.detune = 1200;
				break;
			case BeamType.Plasma:
				beamMaterial = PlasmaBeamMaterial;
				sound.detune = 600;
				break;
		}

		const ballMesh = new THREE.Mesh(ballGeometry, beamMaterial);

		// ballMesh.castShadow = true;
		// ballMesh.receiveShadow = true;
		world.addBody(ballBody);
		scene.add(ballMesh);
		balls.push(ballBody);
		ballMeshes.push(ballMesh);

		const shootDirection = getShotDirection();
		ballBody.velocity.set(
			shootDirection.x * shootVelocity,
			shootDirection.y * shootVelocity,
			shootDirection.z * shootVelocity
		);

		const x =
			sphereBody.position.x + shootDirection.x * (sphereShape.radius * 1.02 + ballShape.radius);
		const y =
			sphereBody.position.y + shootDirection.y * (sphereShape.radius * 1.02 + ballShape.radius);
		const z =
			sphereBody.position.z + shootDirection.z * (sphereShape.radius * 1.02 + ballShape.radius);
		ballBody.position.set(x, y, z);
		ballMesh.position.copy(ballBody.position);
		sound.stop();
		sound.play();
	}
}

function zoom(num) {
	camera.zoom = num;
	camera.updateProjectionMatrix();

	if (num > 1) {
		_isZoomed.set(true);
	} else {
		_isZoomed.set(false);
	}
}

function initPointerLock(element) {
	controls = new PointerLockControlsCannon(camera, sphereBody);
	scene.add(controls.getObject());
	$controls.set(controls);

	element.addEventListener('click', () => {
		controls.lock();
	});

	controls.addEventListener('lock', () => {
		controls.enabled = true;
		// instructions.style.display = 'none';
	});

	controls.addEventListener('unlock', () => {
		controls.enabled = false;
		// instructions.style.display = null;
	});
}

function animate() {
	requestAnimationFrame(animate);

	// Manage time
	const time = performance.now() / 1000;
	const dt = time - lastCallTime;
	lastCallTime = time;

	// Controls
	if (controls.enabled) {
		world.step(timeStep, dt);

		// Raycaster update
		raycaster.setFromCamera(new THREE.Vector2(), camera);
		const intersects = raycaster.intersectObjects(scene.children, false);
		if (intersects.length > 0) {
			lookDistance.set(intersects[0].distance);

			switch (currentVisor) {
				case VisorType.Combat:
					lookObject = null;
					break;
				case VisorType.Scan:
					// if (lookObject != intersects[0].object) {
					// 	if (lookObject) lookObject.material.emissive.setHex(lookObject.currentHex);

					// 	lookObject = intersects[0].object;
					// 	lookObject.currentHex = lookObject.material.emissive.getHex();
					// 	lookObject.material.emissive.setHex(0xff0000);
					// }
					break;
				case VisorType.Thermal:
					lookObject = null;
					break;
				case VisorType.Xray:
					lookObject = null;
					break;
			}
		} else {
			if (lookObject) lookObject.material.emissive.setHex(lookObject.currentHex);
			lookObject = null;
			lookDistance.set(Infinity);
		}

		// Update positions
		for (let i = 0; i < boxes.length; i++) {
			sceneMeshes[i].position.copy(boxes[i].position);
			sceneMeshes[i].quaternion.copy(boxes[i].quaternion);
		}

		for (let i = 0; i < balls.length; i++) {
			ballMeshes[i].position.copy(balls[i].position);
			ballMeshes[i].quaternion.copy(balls[i].quaternion);
		}
	}

	// Render
	controls.update(dt);
	// camera.lookAt(0, 0, 0);
	// camera.zoom.lerp(2, 0.01);
	// camera.updateProjectionMatrix();
	renderer.render(scene, camera);
	updateSeekerPosition();
}

function updateSeekerPosition() {
	const center = seekerObject.position;
	const frustum = new THREE.Frustum();
	const matrix = new THREE.Matrix4().multiplyMatrices(
		camera.projectionMatrix,
		camera.matrixWorldInverse
	);
	frustum.setFromProjectionMatrix(matrix);

	if (frustum.containsPoint(center)) {
		center.project(camera);
		center.x = Math.round((0.5 + center.x / 2) * (canvas.width / window.devicePixelRatio));
		center.y = Math.round((0.5 - center.y / 2) * (canvas.height / window.devicePixelRatio));

		seekerPosition.set({
			x: center.x,
			y: center.y
		});
	}
}

function pickupHealth(event) {
	console.log(event);
	if (event.body === sphereBody) {
		health.update((n) => n + 29);
	}
	// world.removeBody(event.target);
	// scene.remove()
}

function pickupDamage(event) {
	// console.log(event);
	if (event.body === sphereBody) {
		health.update((n) => n - 29);
	}
	// world.removeBody(event.target);
	// scene.remove()
}

class WorldObject {
	constructor(mesh, body) {
		this.mesh;
		this.body;
	}
}
