import { z } from 'zod';

export const ListSchema = z.object({
  name: z.string().min(1).default(''),
  description: z.any().optional(),
  visibleToFamilies: z.array(z.string()).default([]),
  visibleToEvents: z.array(z.string()).default([]),
  visibleToUsers: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  visibilityType: z.enum(['private', 'link', 'public', 'specific']).default('private'),
});

export type ListSchemaType = z.infer<typeof ListSchema>;
