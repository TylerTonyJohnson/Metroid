import { derived, readable, writable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

import { VisorType, BeamType } from './enums';

// Runtime variables
export const isDebugMode = writable(false);

// Health
export const currentHealth = tweened(199, {
	duration: 200
});
export const maxHealth = writable(599);
export const capHealth = readable(1499);

// Danger
export const currentDanger = writable(25);
export const thresholdDanger = readable(75);
export const capDanger = readable(100);
export const hasPingedDanger = writable(false);

// Ammo
export const currentAmmo = tweened(35, {
	duration: 100
});
export const maxAmmo = tweened(65, {
	duration: 100
});
export const capAmmo = readable(250);

// Visor
export const currentVisor = writable(VisorType.Scan);
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

// Look variables
export const isZoomed = writable(false);
export const isLockable = writable(true);
export const seekerPositions = writable([]);	// An array of positions
export const closestSeekerPosition = writable({});	// The closest position
export const isLocked = writable(false);
export const lookMovement = writable({ x: 0, y: 0 });
export const lookPosition = writable({ x: 0, y: 0 });
export const vertLook = writable(50);	// Gonna get rid of these
export const horzLook = writable(50);	// Gonna get rid of these

export const controls = writable();

export const readoutShow = writable(false);
export const readoutMessage = writable('TESTY');
