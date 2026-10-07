import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  // strip TypeScript from components so dist/ ships plain-JS .svelte files
  preprocess: vitePreprocess({ script: true }),
  compilerOptions: { runes: true },
};
