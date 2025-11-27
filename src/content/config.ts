import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(), // YYYY-MM-DD
        image: z.string().optional(),
    }),
});

export const collections = {
    'blog': blogCollection,
};