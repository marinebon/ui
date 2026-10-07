import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// demo page, deployed to GitHub Pages as a project page: https://marinebon.org/ui/
export default defineConfig({
  root: "demo",
  base: "/ui/",
  plugins: [svelte()],
  resolve: {
    alias: { "@marinebon/ui": fileURLToPath(new URL("./src/lib", import.meta.url)) },
  },
  build: { outDir: "../demo-dist", emptyOutDir: true, target: "es2022" },
});
