import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { createExcerpt } from '../utils/create-excerpt';

const parser = new MarkdownIt();

export async function GET(context) {
  const allPosts = await getCollection('blog');
  const posts = allPosts.sort((a, b) => b.data.date - a.data.date);

  return rss({
    title: "Bruno Arueira RSS feed",
    description: 'Bruno Arueira is a software engineer, lately working mostly with ruby, rails, nodejs and react. Besides that, he also knows a bit about DevOps.',
    site: context.site,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: `${createExcerpt(post.body).substring(0, 133)}...`,
      link: `/blog/${post.data.slug}`,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
    customData: `<language>en-US</language>`,
  });
}
