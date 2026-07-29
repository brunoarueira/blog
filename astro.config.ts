// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrism from 'rehype-prism-plus';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { remarkHasCodeBlocks } from './src/plugins/remark-has-code-blocks.mjs';
import rehypeMermaid from 'rehype-mermaid';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: 'https://brunoarueira.com',
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
        [rehypeMermaid, { strategy: 'img-svg' } as any] as any,
        [
          rehypePrism,
	  {
	    showLineNumbers: true
	  } as any
	] as any,
	[
	  rehypeExternalLinks,
	  {
	    content: { type: 'text' },
	    properties: { className: ['external-link'] },
	    target: '_blank',
	    rel: ['noopener', 'noreferrer'],
	  } as any
	],
    ],
    remarkPlugins: [remarkReadingTime, remarkHasCodeBlocks],
    gfm: true
  },
  integrations: [
    mdx(),
    tailwind()
  ]
});
