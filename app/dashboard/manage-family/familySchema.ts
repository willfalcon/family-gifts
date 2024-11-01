import { z } from 'zod';

export const FamilySchema = z.object({
  name: z.string().min(1).default(''),
});

export type FamilySchemaType = z.infer<typeof FamilySchema>;
