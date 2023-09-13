

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.02f6c1dd.js","_app/immutable/chunks/index.13c21116.js","_app/immutable/chunks/singletons.67ec6026.js","_app/immutable/chunks/paths.6824028b.js"];
export const stylesheets = [];
export const fonts = [];
