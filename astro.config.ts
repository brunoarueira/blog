// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'nord',
      wrap: true
    },
    remarkPlugins: [remarkReadingTime],
    gfm: true
  },
  integrations: [
    mdx(),
    tailwind()
  ]
});
