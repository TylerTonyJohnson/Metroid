

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.1dbaa7fb.js","_app/immutable/chunks/index.13c21116.js","_app/immutable/chunks/singletons.f61073ba.js","_app/immutable/chunks/paths.0f71d17b.js"];
export const stylesheets = [];
export const fonts = [];
