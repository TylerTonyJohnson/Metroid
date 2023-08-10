// Declarations

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import CannonUtils from 'cannon-utils';
import { PlayerController } from './controls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { get } from 'svelte/store';
import {
	currentVisor,
	currentHealth,
	maxHealth,
	lookDistance,
	currentBeam,
	isZoomed,
	seekerPositions,
	closestSeekerPosition,
	isLockable,
	isDebugMode,
	isLocked,
	currentDanger,
	isRendering,
	isScanned
} from './stores';
import { BeamType, VisorType } from './enums';
import { clamp, mapRange } from './math';
import { Floater, Metroid } from './worldObjects';
import { GUI } from 'dat.gui';

// THREE variables
let camera, frustum, scene, renderer, raycaster;
let material;
let lookObject;

// CANNON variables
let physicsWorld;
let controls;
let cannonDebugger;
const timeStep = 1 / 60;
let lastCallTime = performance.now();
let sphereShape, sphereBody;
let physicsMaterial;
const boxes = [];
const fliers = [];
const boxMeshes = [];
const missileMeshes = [];
const balls = [];
const ballMeshes = [];
const sceneMeshes = [];
let visibleMeshes = [];
let $closestSeekerPosition;

const metroids = [];

let lockMesh;
let dangerMesh;
let canvas;
let beamSound, missileSound, ambientSound;
let $isDebugMode,
	$currentVisor,
	$currentHealth,
	$currentBeam,
	$isZoomed,
	$isLockable,
	$isRendering,
	$isScanned;
let $seekerPositions;

const dangerDistMin = 2;
const dangerDistMax = 12;

const beamVelocity = 100;
const missileVelocity = 50;

const ballShape = new CANNON.Sphere(0.2);
const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
const flyGeometry = new THREE.SphereGeometry(2, 32, 32);
const powerBeamMaterial = new THREE.MeshBasicMaterial({ color: '#FFB508' });
const waveBeamMaterial = new THREE.MeshBasicMaterial({ color: '#9C84FE' });
const iceBeamMaterial = new THREE.MeshBasicMaterial({ color: '#5AE7F8' });
const plasmaBeamMaterial = new THREE.MeshBasicMaterial({ color: '#FF4A49' });
const missileMaterial = new THREE.MeshBasicMaterial({ color: '#666666' });

let flyAngle = 0;
const flySpeed = 0.1;
const flyRadius = 10;

export const listener = new THREE.AudioListener();

const stats = new Stats();
document.body.appendChild(stats.dom);

/* 
	Start the simulation
*/

export function start(element) {
	canvas = element;
	initSubscribe();
	initThree(canvas);
	initCannon();
	initPointerLock(canvas);
	buildWorld();
	animate();
}

function initSubscribe() {
	isDebugMode.subscribe((value) => {
		$isDebugMode = value;
	});

	currentVisor.subscribe((value) => {
		$currentVisor = value;
	});

	currentHealth.subscribe((value) => {
		$currentHealth = value;
	});

	currentBeam.subscribe((value) => {
		$currentBeam = value;
	});

	seekerPositions.subscribe((value) => {
		$seekerPositions = value;
	});

	closestSeekerPosition.subscribe((value) => {
		$closestSeekerPosition = value;
	});

	isZoomed.subscribe((value) => {
		$isZoomed = value;
	});

	isLockable.subscribe((value) => {
		$isLockable = value;
	});

	isRendering.subscribe((value) => {
		$isRendering = value;
	});

	isScanned.subscribe((value) => {
		$isScanned = value;
	});
}

function initThree(element) {
	// Camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000);
	// camera.up = new THREE.Vector3(0, 0, 1); // Not sure this is necessary?

	// Sound
	camera.add(listener);

	// Scene
	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog(0x000000, 0, 500);	// Sets background to black

	// Renderer
	renderer = new THREE.WebGLRenderer({ antialias: true, canvas: element });
	renderer.useLegacyLights = false;
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
	renderer.toneMapping = THREE.CineonToneMapping;
	renderer.toneMappingExposure = 1.75;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor('#211d20');


	// Raycaster
	raycaster = new THREE.Raycaster();

	// Helpers
	const axesHelper = new THREE.AxesHelper();
	scene.add(axesHelper);

	// Cleanup
	window.addEventListener('resize', onWindowResize);
}

/* 
	---------- LOAD ASSETS ----------
*/

function buildWorld() {
	const loadingManager = new THREE.LoadingManager();

	/* 
		Audio
	*/

	const audioLoader = new THREE.AudioLoader(loadingManager);

	beamSound = new THREE.Audio(listener);
	audioLoader.load('Power Beam Sound.wav', function (buffer) {
		beamSound.setBuffer(buffer);
		beamSound.setVolume(0.25);
	});

	missileSound = new THREE.Audio(listener);
	audioLoader.load('Missile Sound.wav', function (buffer) {
		missileSound.setBuffer(buffer);
		missileSound.setVolume(0.25);
	});

	/* 
		Textures
	*/

	const skyboxUrls = [
		'purple_skybox/front.png',
		'purple_skybox/back.png',
		'purple_skybox/top.png',
		'purple_skybox/bottom.png',
		'purple_skybox/left.png',
		'purple_skybox/right.png'
	];

	const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
	const cubeTexture = cubeTextureLoader.load(skyboxUrls);
	scene.background = cubeTexture;

	/* 
	GLTF Models
*/
	const gltfLoader = new GLTFLoader(loadingManager);

	gltfLoader.load(`sci_fi_hangar.glb`, (glb) => {
		const content = glb.scene;
		content.position.set(0, 10.75, 0);
		content.scale.set(16, 16, 16);
		scene.add(content);
	});

	// Lighting
	const directionalLight = new THREE.DirectionalLight(0x9090aa, 10);
	directionalLight.position.set(-10, 10, -10).normalize();
	// scene.add(directionalLight);

	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 10);
	hemisphereLight.position.set(1, 1, 1);
	scene.add(hemisphereLight);

	const spotlight = new THREE.SpotLight(0xffffff, 10, 100, Math.PI / 8, 1, 1);
	const spotlightHelper = new THREE.SpotLightHelper(spotlight);
	spotlight.position.set(0, 20, 0);
	spotlight.target.position.set(0, 0, 0);

	spotlight.castShadow = true;

	spotlight.shadow.camera.near = 10;
	spotlight.shadow.camera.far = 100;
	spotlight.shadow.camera.fov = 30;

	// spotlight.shadow.bias = -0.0001
	spotlight.shadow.mapSize.width = 2048;
	spotlight.shadow.mapSize.height = 2048;

	scene.add(spotlight);
	scene.add(spotlight.target);
	scene.add(spotlightHelper);
}

function initCannon() {
	physicsWorld = new CANNON.World();
	physicsWorld.broadphase = new CANNON.SAPBroadphase(physicsWorld);
	physicsWorld.allowSleep = true;

	cannonDebugger = new CannonDebugger(scene, physicsWorld);

	physicsWorld.defaultContactMaterial.contactEquationStiffness = 1e9;
	physicsWorld.defaultContactMaterial.contactEquationRelaxation = 4;

	const solver = new CANNON.GSSolver();
	solver.iterations = 7;
	solver.tolerance = 0.1;
	physicsWorld.solver = new CANNON.SplitSolver(solver);
	physicsWorld.gravity.set(0, -32.2, 0);

	// Create slippery material
	physicsMaterial = new CANNON.Material('physics');
	const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
		friction: 0,
		restitution: 0.3
	});

	// Add contact materials to world
	physicsWorld.addContactMaterial(physics_physics);

	// Create user collision sphere
	const radius = 1;
	sphereShape = new CANNON.Sphere(radius);
	sphereBody = new CANNON.Body({ mass: 5, material: physicsMaterial });
	sphereBody.addShape(sphereShape);
	sphereBody.position.set(0, 5, -5);
	sphereBody.linearDamping = 0.9;
	sphereBody.fixedRotation = true;
	physicsWorld.addBody(sphereBody);

	// Create ground plane
	const groundShape = new CANNON.Plane();
	const groundBody = new CANNON.Body({ mass: 0, material: physicsMaterial });
	groundBody.addShape(groundShape);
	groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
	physicsWorld.addBody(groundBody);

	// Add boxes in cannon and three
	const halfExtents = new CANNON.Vec3(1, 1, 1);
	const boxShape = new CANNON.Box(halfExtents);
	const boxGeometry = new THREE.BoxGeometry(
		halfExtents.x * 2,
		halfExtents.y * 2,
		halfExtents.z * 2
	);

	for (let i = 0; i < 1; i++) {
		const boxBody = new CANNON.Body({ mass: 5 });
		boxBody.addShape(boxShape);
		const boxMesh = new THREE.Mesh(
			boxGeometry,
			new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
		);

		boxMesh.onBeforeRender = () => {
			if (!visibleMeshes.includes(boxMesh)) visibleMeshes.push(boxMesh);
		};

		boxMesh.name = i;
		const x = (Math.random() - 0.5) * 20;
		const y = (Math.random() - 0.5) * 1 + 1;
		const z = (Math.random() - 0.5) * 20;

		boxBody.position.set(x, y, z);
		boxMesh.position.copy(boxBody.position);

		boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;

		physicsWorld.addBody(boxBody);
		scene.add(boxMesh);
		boxes.push(boxBody);
		sceneMeshes.push(boxMesh);
	}

	for (let i = 0; i < 1; i++) {
		// const flyBody = new CANNON.Body({ mass: 5 });
		// flyBody.addShape(ballShape);
		const flyMesh = new THREE.Mesh(
			flyGeometry,
			new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
		);

		flyMesh.onBeforeRender = () => {
			if (!visibleMeshes.includes(flyMesh)) visibleMeshes.push(flyMesh);
		};

		flyMesh.name = i;
		// const x = (Math.random() - 0.5) * 20;
		// const y = (Math.random() - 0.5) * 1 + 1;
		// const z = (Math.random() - 0.5) * 20;
		const x = flyRadius * Math.cos(flyAngle);
		const y = 20;
		const z = flyRadius * Math.sin(flyAngle);

		// flyBody.position.set(x, y, z);
		// flyMesh.position.copy(flyBody.position);
		flyMesh.position.set(x, y, z);

		flyMesh.castShadow = true;
		flyMesh.receiveShadow = true;

		// physicsWorld.addBody(flyBody);
		scene.add(flyMesh);
		fliers.push(flyMesh);
		// sceneMeshes.push(flyMesh);
	}

	// ADDING FUN STUFF

	// Glass tube
	// const envmap = new THREE.CubeTextureLoader().load([
	// 	'purple_skybox/front.png',
	// 	'purple_skybox/back.png',
	// 	'purple_skybox/top.png',
	// 	'purple_skybox/bottom.png',
	// 	'purple_skybox/left.png',
	// 	'purple_skybox/right.png'
	// ]);

	// const glassShape = new CANNON.Cylinder(24, 24, 40, 60);
	// const glassBody = new CANNON.Body({
	// 	type: CANNON.Body.STATIC,
	// 	shape: glassShape
	// });
	// glassBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
	// glassBody.position.set(0, 10, 0);

	// physicsWorld.add(glassBody);

	// const glassGeo = new THREE.CylinderGeometry(24, 24, 40, 60);
	// const glassMat = new THREE.MeshPhysicalMaterial({
	// 	color: 'gray',
	// 	side: THREE.DoubleSide,
	// 	envMap: envmap,
	// 	transparent: true,
	// 	opacity: 1,
	// 	transmission: 1,
	// 	roughness: 0,
	// 	ior: 1.5,
	// 	thickness: 2
	// });

	// const glassMesh = new THREE.Mesh(glassGeo, glassMat);
	// glassMesh.position.copy(glassBody.position);
	// scene.add(glassMesh);

	// Walking platforms
	// const pillarShapeTwo = new CANNON.Cylinder(32.6, 32.6, 40, 60);
	// const pillarBodyTwo = new CANNON.Body({
	// 	type: CANNON.Body.STATIC,
	// 	shape: pillarShapeTwo
	// });
	// pillarBodyTwo.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
	// pillarBodyTwo.position.set(0, -18.75, 0);

	// physicsWorld.add(pillarBodyTwo);

	// const pillarShapeThree = new CANNON.Cylinder(40, 40, 40, 60);
	// const pillarBodyThree = new CANNON.Body({
	// 	type: CANNON.Body.STATIC,
	// 	shape: pillarShapeThree
	// });
	// pillarBodyThree.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
	// pillarBodyThree.position.set(0, -22, 0);

	// physicsWorld.add(pillarBodyThree);

	// Outer glass window
	// const windowShape = new CANNON.Box(new CANNON.Vec3(40, 40, 1));
	// const windowBody = new CANNON.Body({
	// 	type: CANNON.Body.STATIC,
	// 	shape: windowShape
	// });
	// windowBody.position.set(0, 0, -76);
	// physicsWorld.add(windowBody);

	// const windowGeo = new THREE.BoxGeometry(80, 80, 2);

	// const windowMesh = new THREE.Mesh(windowGeo, glassMat);
	// windowMesh.position.copy(windowBody.position);
	// scene.add(windowMesh);

	// Center laser

	// const laserMat = new THREE.MeshBasicMaterial({

	//     blending: THREE.AdditiveBlending,
	//     color: 0xffffff,
	// });
	// const laserGeo = new THREE.CylinderGeometry(0.1, 0.1, 40, 8);
	// const laserMesh = new THREE.Mesh(laserGeo, laserMat)
	// scene.add(laserMesh);

	// Lights
	const newLight = new THREE.PointLight(0xff9900, 10);
	newLight.position.set(0, 100, 0);
	scene.add(newLight);
	console.log(newLight);

	const botLight = new THREE.SpotLight(0xff0000, 2, 100, Math.PI / 2);
	botLight.rotateY(Math.PI);
	botLight.position.set(0, -20, 0);
	scene.add(botLight);

	const topLight = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 2);
	topLight.position.set(0, 50, 0);
	scene.add(topLight);

	// Metroids
	// for (let i = 0; i < 30; i++) {
	// 	new Metroid(scene, metroids);
	// }

	// console.log(metroids);

	// const floater = new Floater();
	// floater.setPosition(2, 3, 2);
	// addMatter(floater);

	// function addMatter(matter) {
	// 	physicsWorld.add(matter.body);
	// 	scene.add(matter.mesh);
	// }

	// dangerMesh = sceneMeshes[0];
	// dangerMesh.material = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff });
	// lockMesh = sceneMeshes[0];
	// console.log(lockMesh);

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

	/* 
		GLTF STUFF
	*/

	// loader.load(`level_blockout.glb`, (glb) => {
	// 	const content = glb.scene;
	// 	scene.add(content);

	// 	const convexHull = new ConvexHull().setFromObject(content);
	// 	// const convexShape = CannonUtils.CreateTriMesh(convexHull);
	// 	console.log(convexHull);
	// });

	// loader.load(`plasma_beam.glb`, (glb) => {
	// 	const content = glb.scene;
	// 	content.position.set(0, 1, 0);
	// 	scene.add(content);
	// 	const convexHull = new ConvexHull().setFromObject(content);
	// });

	// loader.load(`hallway.glb`, (glb) => {
	// 	const content = glb.scene;
	// 	// content.scale.set(0.2,0.2,0.2);
	// 	content.position.set(0, -1.5, 0);
	// 	content.rotation.set(0, Math.PI/2, 0);
	// 	content.scale.set(0.8,0.8,0.8);
	// 	scene.add(content);

	// 	// console.log(content);
	// 	const convexHull = new ConvexHull().setFromObject(content);
	// 	// const shape = CannonUtils.CreateTriMesh(convexHull.vertices);
	// });

	// loader.load(`plasma_beam.glb`, (glb) => {
	// 	const gltf = glb.scene;
	// 	camera.add(gltf);
	// 	gltf.position.set(0.1, 0, -0.5);
	// 	gltf.rotation.set(0.1, Math.PI, 1);
	// 	// gltf.quaternion.copy(camera.quaternion);
	// });
}

export function shootBeam(event) {
	if (!controls.enabled) {
		return;
	}
	const beamBody = new CANNON.Body({ type: CANNON.Body.KINEMATIC });
	beamBody.addShape(ballShape);
	let beamMaterial;

	switch ($currentBeam) {
		case BeamType.Power:
			beamMaterial = powerBeamMaterial;
			break;
		case BeamType.Wave:
			beamMaterial = waveBeamMaterial;
			break;
		case BeamType.Ice:
			beamMaterial = iceBeamMaterial;
			break;
		case BeamType.Plasma:
			beamMaterial = plasmaBeamMaterial;
			break;
	}

	const ballMesh = new THREE.Mesh(ballGeometry, beamMaterial);

	// ballMesh.castShadow = true;
	// ballMesh.receiveShadow = true;
	physicsWorld.addBody(beamBody);
	scene.add(ballMesh);
	balls.push(beamBody);
	ballMeshes.push(ballMesh);

	const shootDirection = getShotDirection();
	beamBody.velocity.set(
		shootDirection.x * beamVelocity,
		shootDirection.y * beamVelocity,
		shootDirection.z * beamVelocity
	);

	const x =
		sphereBody.position.x + shootDirection.x * (sphereShape.radius * 1.02 + ballShape.radius);
	const y =
		sphereBody.position.y + shootDirection.y * (sphereShape.radius * 1.02 + ballShape.radius);
	const z =
		sphereBody.position.z + shootDirection.z * (sphereShape.radius * 1.02 + ballShape.radius);
	beamBody.position.set(x, y, z);
	ballMesh.position.copy(beamBody.position);
	if (beamSound.isPlaying) beamSound.stop();
	beamSound.play();
}

export function shootMissile() {
	if (!controls.enabled) {
		return;
	}
	const missileBody = new CANNON.Body({ type: CANNON.Body.KINEMATIC });
	missileBody.addShape(ballShape);

	const ballMesh = new THREE.Mesh(ballGeometry, missileMaterial);

	physicsWorld.addBody(missileBody);
	scene.add(ballMesh);
	balls.push(missileBody);
	ballMeshes.push(ballMesh);

	const shootDirection = getShotDirection();
	missileBody.velocity.set(
		shootDirection.x * missileVelocity,
		shootDirection.y * missileVelocity,
		shootDirection.z * missileVelocity
	);

	const x =
		sphereBody.position.x + shootDirection.x * (sphereShape.radius * 1.02 + ballShape.radius);
	const y =
		sphereBody.position.y + shootDirection.y * (sphereShape.radius * 1.02 + ballShape.radius);
	const z =
		sphereBody.position.z + shootDirection.z * (sphereShape.radius * 1.02 + ballShape.radius);
	missileBody.position.set(x, y, z);
	ballMesh.position.copy(missileBody.position);
	if (missileSound.isPlaying) missileSound.stop();
	missileSound.play();
}

function getShotDirection() {
	const vector = new THREE.Vector3(0, 0, 1);
	vector.unproject(camera);
	const ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize());
	return ray.direction;
}

function zoom(num) {
	camera.zoom = num;
	camera.updateProjectionMatrix();

	if (num > 1) {
		isZoomed.set(true);
	} else {
		isZoomed.set(false);
	}
}

function initPointerLock(element) {
	controls = new PlayerController(camera, sphereBody);
	scene.add(controls.getObject());

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
	const timeElapsed = time - lastCallTime;
	lastCallTime = time;

	// Controls
	if (controls.enabled && !$isScanned) {
		physicsWorld.step(timeStep, timeElapsed, 3);

		// Raycaster update
		raycaster.setFromCamera(new THREE.Vector2(), camera);
		const intersects = raycaster.intersectObjects(scene.children, false);
		if (intersects.length > 0) {
			lookDistance.set(intersects[0].distance);

			// switch ($currentVisor) {
			// 	case VisorType.Combat:
			// 		lookObject = null;
			// 		break;
			// 	case VisorType.Scan:
			// 		// if (lookObject != intersects[0].object) {
			// 		// 	if (lookObject) lookObject.material.emissive.setHex(lookObject.currentHex);

			// 		// 	lookObject = intersects[0].object;
			// 		// 	lookObject.currentHex = lookObject.material.emissive.getHex();
			// 		// 	lookObject.material.emissive.setHex(0xff0000);
			// 		// }
			// 		break;
			// 	case VisorType.Thermal:
			// 		lookObject = null;
			// 		break;
			// 	case VisorType.Xray:
			// 		lookObject = null;
			// 		break;
			// }
		} else {
			// if (lookObject) lookObject.material.emissive.setHex(lookObject.currentHex);
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

		flyAngle += 0.01;
		fliers.forEach((flier) => {
			const x = flyRadius * Math.cos(flyAngle);
			const z = flyRadius * Math.sin(flyAngle);

			flier.position.x = x;
			flier.position.y = 20;
			flier.position.z = z;
		});

		// if (metroids.length > 0) {
		// 	metroids.forEach((metroid) => {
		// 		metroid.update(timeElapsed);
		// 	});
		// }

		// Render
		if ($isDebugMode) {
			cannonDebugger.update();
		} else {
			cannonDebugger.enabled = false;
		}

		controls.update(timeElapsed);
		renderer.render(scene, camera);
		updateSeekerPosition(timeElapsed);
		updateDanger();

		//   
		stats.update();
	}
}

export function getLockMesh() {
	if (!$isLockable) return null;
	lockMesh = $closestSeekerPosition;
	return lockMesh;
}
export function releaseLockMesh() {
	lockMesh = null;
}

function updateSeekerPosition(timeElapsed) {
	// Set visible meshes
	seekerPositions.set(
		visibleMeshes
			.map((object) => object.position.project(camera))
			.sort((a, b) => {
				const aDist = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
				const bDist = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2));
				return aDist - bDist;
			})
	);
	// console.log($seekerPositions);
	visibleMeshes = [];

	// Check if there are any seeker meshes
	if (!$seekerPositions.length) {
		closestSeekerPosition.set(new THREE.Vector3());
		isLockable.set(false);
		return;
	}

	// Handle interpolation
	// const t = 1.0 - Math.pow(0.01, 5 * timeElapsed);
	// const currentVector = x;
	// closestSeekerPosition.set($closestSeekerPosition.lerp($seekerPositions[0], t));
	// console.log($closestSeekerPosition);

	closestSeekerPosition.set($seekerPositions[0]);
	isLockable.set(true);

	// seekerPositionX.set($seekerPositions[0].x);
	// seekerPositionY.set($seekerPositions[0].y);
}

function updateDanger() {
	const distance = controls.object.position.distanceTo(new THREE.Vector3());
	const clampedDist = clamp(distance, dangerDistMin, dangerDistMax);
	const flippedDist = dangerDistMax - clampedDist;
	const scaledDist = mapRange(flippedDist, 0, 10, 0, 100);
	currentDanger.set(scaledDist);
}

// function pickupHealth(event) {
// 	console.log(event);
// 	if (event.body === sphereBody) {
// 		health.update((n) => n + 29);
// 	}
// 	// world.removeBody(event.target);
// 	// scene.remove()
// }

// function pickupDamage(event) {
// 	// console.log(event);
// 	if (event.body === sphereBody) {
// 		health.update((n) => n - 29);
// 	}
// 	// world.removeBody(event.target);
// 	// scene.remove()
// }

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
}
