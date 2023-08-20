

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.cc36a794.js","_app/immutable/chunks/index.13c21116.js","_app/immutable/chunks/singletons.97ba4bc1.js","_app/immutable/chunks/paths.588be1af.js"];
export const stylesheets = [];
export const fonts = [];
