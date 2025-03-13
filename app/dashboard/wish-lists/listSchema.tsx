import { z } from 'zod';

export const ListSchema = z.object({
  name: z.string().min(1).default(''),
  description: z.any().optional(),
  visibleTo: z.array(z.string()).default([]),
});

export type ListSchemaType = z.infer<typeof ListSchema>;
