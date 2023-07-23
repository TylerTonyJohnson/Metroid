

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.d4a1388e.js","_app/immutable/chunks/index.50a87664.js","_app/immutable/chunks/singletons.ecca7167.js","_app/immutable/chunks/index.11557c90.js"];
export const stylesheets = [];
export const fonts = [];
