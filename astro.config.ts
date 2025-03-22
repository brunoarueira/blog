// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'nord',
      wrap: true
    },
    rehypePlugins: [
	[
	  rehypeExternalLinks,
	  {
	    content: { type: 'text' },
	    properties: { className: ['external-link'] },
	    target: '_blank',
	    rel: ['noopener', 'noreferrer'],
	  }
	],
    ],
    remarkPlugins: [remarkReadingTime],
    gfm: true
  },
  integrations: [
    mdx(),
    tailwind()
  ]
});
