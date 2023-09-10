

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.c8c1b00a.js","_app/immutable/chunks/index.13c21116.js","_app/immutable/chunks/singletons.e444078a.js","_app/immutable/chunks/paths.c2c78ad2.js"];
export const stylesheets = [];
export const fonts = [];
