import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://phaseolud.github.io",
  integrations: [react(), mdx({
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }), sitemap(), tailwind()]
});