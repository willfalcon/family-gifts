import { z } from 'zod';

export const ListSchema = z.object({
  name: z.string().min(1).default(''),
  visibleTo: z.array(z.string()).default([]),
});

export type ListSchemaType = z.infer<typeof ListSchema>;
