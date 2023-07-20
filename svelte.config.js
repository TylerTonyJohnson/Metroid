import adapter from "@sveltejs/adapter-static"; 

const config = {
	kit: {
		adapter: adapter({
			pages: "docs",
			assets: "docs"
		}),
		paths: {
			base: "/Metroid",
		},
		target: "#svelte"
	}
};

export default config;
