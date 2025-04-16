// @ts-check
import { defineConfig } from "astro/config";

import solid from "@astrojs/solid-js";
import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://syvpelikaner.github.io",
  base: "site",
  integrations: [
    solid({
      include: ["**/solid/**"],
    }),
  ],

  vite: {
    // @ts-expect-error
    plugins: [glsl(), tailwindcss()],
  },
});
