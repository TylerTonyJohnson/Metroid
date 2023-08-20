

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.b4cdee38.js","_app/immutable/chunks/index.13c21116.js","_app/immutable/chunks/singletons.c0a20504.js","_app/immutable/chunks/paths.f90bf3bc.js"];
export const stylesheets = [];
export const fonts = [];
