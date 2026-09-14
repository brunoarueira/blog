import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { resolveContentImages } from '../../utils/resolve-content-images';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');

  return posts.map((post) => ({
    params: { slug: post.data.slug },
    props: { post },
  }));
};

type Props = { post: CollectionEntry<'blog'> };

// Raw Markdown mirror of each post, so AI agents (and anyone else) can fetch
// clean source instead of parsing rendered HTML. `post.body` is the
// unprocessed Markdown/MDX source — same field `feed.xml.js` already reads
// for RSS descriptions/content, just returned as-is here instead of through
// markdown-it.
export const GET: APIRoute<Props> = async ({ props, site }) => {
  const { post } = props;
  const canonicalUrl = new URL(`/blog/${post.data.slug}/`, site);
  const body = await resolveContentImages(post.body ?? '', post, site);

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(post.data.title)}`,
    `date: ${new Date(post.data.date).toISOString().slice(0, 10)}`,
    `tags: [${post.data.tags.map((tag) => JSON.stringify(tag)).join(', ')}]`,
    `source: ${canonicalUrl}`,
    '---',
    '',
    '',
  ].join('\n');

  return new Response(`${frontmatter}${body}`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
