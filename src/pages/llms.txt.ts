import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { sortByDate } from '../utils/sortByDate';
import { createExcerpt } from '../utils/create-excerpt';
import { siteName, siteDescription } from '../utils/site';

// Site index for AI agents, following the https://llmstxt.org convention.
// Each post links to its Markdown mirror (see blog/[slug].md.ts) instead of
// the HTML page, so an agent can fetch clean content directly.
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('blog')).sort(sortByDate);

  const postLinks = posts.map((post) => {
    const url = new URL(`/blog/${post.data.slug}.md`, site);
    const excerpt = createExcerpt(post.body ?? '').substring(0, 133);
    return `- [${post.data.title}](${url}): ${excerpt}...`;
  });

  const body = [
    `# ${siteName}`,
    '',
    `> ${siteDescription}`,
    '',
    'This site publishes a clean Markdown version of every page. Append `.md` to',
    'any blog post URL (e.g. `/blog/<slug>.md`) for the raw content, or fetch',
    '/llms-full.txt for every post concatenated into one file.',
    '',
    '## Blog posts',
    '',
    ...postLinks,
    '',
    '## Pages',
    '',
    `- [About](${new URL('/about/', site)})`,
    `- [Contributions](${new URL('/contributions/', site)})`,
    '',
    '## Feeds',
    '',
    `- [RSS feed](${new URL('/feed.xml', site)})`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
