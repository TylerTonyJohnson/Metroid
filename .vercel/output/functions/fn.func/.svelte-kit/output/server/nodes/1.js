

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.6b6906e1.js","_app/immutable/chunks/index.50a87664.js","_app/immutable/chunks/singletons.5aff3819.js","_app/immutable/chunks/index.11557c90.js"];
export const stylesheets = [];
export const fonts = [];
