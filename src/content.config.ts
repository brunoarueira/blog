import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string().transform((str) => Date.parse(str)),
    tags: z.array(z.string())
  }),
});

export const collections = { blog };
