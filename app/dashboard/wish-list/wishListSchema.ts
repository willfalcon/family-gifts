import { z } from 'zod';

export const ItemSchema = z.object({
  name: z.string().min(1).default(''),
  link: z
    .union([z.literal(''), z.string().trim().url()])
    .optional()
    .default(''),
  notes: z.string().optional().default(''),
  category: z.string().default(''),
});

export type ItemSchemaType = z.infer<typeof ItemSchema>;
