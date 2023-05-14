import { readable, writable } from "svelte/store";
import { VisorType, BeamType } from './enums';

export const currentHealth = writable(199);
export const maxHealth = writable(499);

export const currentVisor = writable(VisorType.Combat);
export const unlockedVisors = writable([VisorType.Combat, VisorType.Scan, VisorType.Thermal, VisorType.Xray]);

export const currentBeam = writable(BeamType.Power);
export const unlockedBeams = writable([BeamType.Power, BeamType.Wave, BeamType.Ice, BeamType.Plasma]);

export const lookDistance = writable(0);
export const lookDistMin = readable(5);
export const lookDistMax = readable(50);

export const isZoomed = writable(false);
export const lookMovement = writable({x: 0, y: 0});
export const vertLook = writable(50);
export const horzLook = writable(50);

export const currentDanger = writable(25);

export const currentAmmo = writable(35);
export const maxAmmo = writable(65);

export const controls = writable();

export const readoutShow = writable(false);
export const readoutMessage = writable("TESTY");