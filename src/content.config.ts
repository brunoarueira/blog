import { z, defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string().transform((str) => Date.parse(str)),
    tags: z.array(z.string())
  }),
});

const contributions = defineCollection({
  loader: file('content/contributions.yml'),
  schema: z.object({
    repo: z.string(),
    title: z.string(),
    url: z.string().url(),
    number: z.number(),
    mergedAt: z.coerce.date(),
    description: z.string(),
    technologies: z.array(z.string()),
    featured: z.boolean().optional().default(false)
  }),
});

export const collections = { blog, contributions };
