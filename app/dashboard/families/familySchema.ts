import { z } from 'zod';

export const FamilySchema = z.object({
  name: z.string().min(1).default(''),
  description: z.any().optional(),
  members: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .optional(),
});

export type FamilySchemaType = z.infer<typeof FamilySchema>;
