import { z } from 'zod';

export const ItemSchema = z.object({
  name: z.string().min(1).default(''),
  link: z
    .union([z.literal(''), z.string().trim().url()])
    .optional()
    .default(''),
  image: z
    .instanceof(File)
    .refine((file) => file.size < 4500000, {
      message: 'Image must be less than 4.5MB',
    })
    .optional(),
  imageUrl: z.string().optional(),
  notes: z.any().optional(),
  price: z.number().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).optional().nullable(),
  categories: z.array(z.string()).default([]),
});

export type ItemSchemaType = z.infer<typeof ItemSchema>;
