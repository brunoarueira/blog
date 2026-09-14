import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { sortByDate } from '../utils/sortByDate';

// Companion to /llms.txt for agents that can't/won't crawl link by link:
// every post's full Markdown source in one file. Small enough to stay a
// single file at today's post count (~9 posts).
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('blog')).sort(sortByDate);

  const sections = posts.map((post) => {
    const url = new URL(`/blog/${post.data.slug}/`, site);

    return [
      `# ${post.data.title}`,
      '',
      `Source: ${url}`,
      `Date: ${new Date(post.data.date).toISOString().slice(0, 10)}`,
      `Tags: ${post.data.tags.join(', ')}`,
      '',
      (post.body ?? '').trim(),
    ].join('\n');
  });

  const body = `# Bruno Arueira — full blog content\n\n${sections.join('\n\n---\n\n')}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
