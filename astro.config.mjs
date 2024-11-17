// @ts-check
import { defineConfig } from "astro/config";

import solid from "@astrojs/solid-js";
import glsl from "vite-plugin-glsl";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://syvpelikaner.github.io",
  base: "site",
  integrations: [
    solid({
      include: ["**/solid/**"],
    }),
    tailwind(),
  ],

  vite: {
    plugins: [glsl()],
  },
});
