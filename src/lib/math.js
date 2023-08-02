export function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function wrap(value, min, max) {
	
	if (value > max || value < min) return value % max;	//Not sure if this works for moving min

	return value;
}
