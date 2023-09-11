

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.a522356d.js","_app/immutable/chunks/index.13c21116.js","_app/immutable/chunks/singletons.1ed4e0d4.js","_app/immutable/chunks/paths.15a7b4ce.js"];
export const stylesheets = [];
export const fonts = [];
