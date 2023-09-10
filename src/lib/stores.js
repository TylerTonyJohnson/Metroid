import { derived, readable, writable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import { AppState, VisorType, BeamType } from './enums';

// Gateway variables
export const loadPercent = writable(0);
export const appState = writable(AppState.None);
export const isLoaded = derived(loadPercent, $loadPercent => 
	$loadPercent > 0
);

export const hasDisclaimed = writable(true);
export const navigationState = writable("none");

// Runtime variables
export const isDebugMode = writable(false);
export const isRendering = writable(false);

// Health
export const currentHealth = tweened(199, {
	duration: 200
});
export const maxHealth = writable(299);
export const capHealth = readable(1499);

// Danger
export const currentDanger = writable(25);
export const thresholdDanger = readable(75);
export const capDanger = readable(100);
export const hasPingedDanger = writable(false);

// Ammo
export const currentAmmo = tweened(10, {
	duration: 100
});
export const maxAmmo = tweened(25, {
	duration: 100
});
export const capAmmo = readable(250);

// Visor
export const currentVisor = writable(VisorType.Combat);
export const unlockedVisors = writable([
	VisorType.Combat,
	VisorType.Scan,
	VisorType.Thermal,
	VisorType.Xray
]);

// Beam
export const currentBeam = writable(BeamType.Power);
export const unlockedBeams = writable([
	BeamType.Power,
	BeamType.Wave,
	BeamType.Ice,
	BeamType.Plasma
]);

export const lookDistance = writable(0);
export const lookDistMin = readable(5);
export const lookDistMax = readable(50);

// Scanning
export const isScanning = writable(false);
export const scanProgress = tweened(0, {duration: 2000});
export const isScanned = derived(scanProgress, ($scanProgress) => 
	$scanProgress === 100
)

// Look variables
export const lookMovement = writable({ x: 0, y: 0 });
export const lookPosition = writable({ x: 0, y: 0 });

// Seeker
export const seekerPositions = writable([]);	// An array of positions
export const closestSeekerPosition = writable({});	// The closest position
export const isLockable = writable(false);
export const isLocked = writable(false);
export const closestSeekerType = writable(null);


export const readoutShow = writable(false);
export const readoutMessage = writable('TESTY');
