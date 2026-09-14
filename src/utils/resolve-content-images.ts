import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import path from 'node:path';

// Every image colocated with blog content, keyed by its Vite-root-relative
// path — a leading-slash glob pattern resolves against the project root.
const contentImages = import.meta.glob<{ default: ImageMetadata }>(
  '/content/blog/**/*.{png,jpg,jpeg,gif,svg,webp}',
  { eager: true },
);

const RELATIVE_IMAGE = /!\[([^\]]*)\]\(\.\/([^\s)]+)((?:\s+["'][^"']*["'])?)\)/g;

function contentBlogRelativeDir(filePath: string): string {
  // filePath is root-relative (e.g. "content/blog/some-post/index.mdx"), not
  // an absolute filesystem path.
  const normalized = filePath.replaceAll('\\', '/');
  const marker = 'content/blog/';
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex === -1) return '';

  const relative = normalized.slice(markerIndex + marker.length);
  const dir = path.posix.dirname(relative);
  return dir === '.' ? '' : dir;
}

// Astro's image pipeline only rewrites `./local.png`-style references
// co-located with a post's source file when rendering the HTML page via
// <Content /> (see blog/[slug].astro's `render(post)`). The raw Markdown
// served by blog/[slug].md.ts doesn't go through that pipeline, so those
// references would 404 as-is — resolve them here to the same kind of built
// /_astro/ asset, so the Markdown mirror's images actually load.
export async function resolveContentImages(
  body: string,
  post: CollectionEntry<'blog'>,
  site: URL | undefined,
): Promise<string> {
  if (!post.filePath) return body;

  const matches = [...body.matchAll(RELATIVE_IMAGE)];
  if (matches.length === 0) return body;

  const dir = contentBlogRelativeDir(post.filePath);
  const replacements = new Map<string, string>();

  for (const [, , filename] of matches) {
    if (replacements.has(filename)) continue;

    const key = `/content/blog/${dir ? `${dir}/` : ''}${filename}`;
    const module = contentImages[key];
    if (!module) continue;

    const optimized = await getImage({ src: module.default });
    replacements.set(filename, new URL(optimized.src, site).toString());
  }

  return body.replace(RELATIVE_IMAGE, (full, alt, filename, titlePart) => {
    const src = replacements.get(filename);
    return src ? `![${alt}](${src}${titlePart})` : full;
  });
}
