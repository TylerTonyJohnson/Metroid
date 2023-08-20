

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.fe844a38.js","_app/immutable/chunks/index.13c21116.js","_app/immutable/chunks/singletons.0cbc64c6.js","_app/immutable/chunks/paths.aee212b9.js"];
export const stylesheets = [];
export const fonts = [];
