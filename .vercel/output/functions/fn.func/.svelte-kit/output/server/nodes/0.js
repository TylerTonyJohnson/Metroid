

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.427d94f5.js","_app/immutable/chunks/index.13c21116.js"];
export const stylesheets = [];
export const fonts = [];
