// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrism from 'rehype-prism-plus';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { remarkHasCodeBlocks } from './src/plugins/remark-has-code-blocks.mjs';
import rehypeMermaid from 'rehype-mermaid';

import mdx from "@astrojs/mdx";

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://brunoarueira.com',
  build: {
    // Fold every page stylesheet into a <style> tag in <head>. Total CSS is
    // ~19 KB uncompressed (Layout + page-ssr + the two Prism themes), so
    // inlining removes 3-4 render-blocking requests from the critical path
    // for a few KB of brotli'd HTML per page. Worth it for a static blog.
    inlineStylesheets: 'always',
  },
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
    tailwind(),
    sitemap()
  ]
});
