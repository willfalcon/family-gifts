import { z } from 'zod';

export const FamilyMemberSchema = z.object({
  name: z.string().min(1).default(''),
  email: z.string().email().default('')
});

export type FamilyMemberSchemaType = z.infer<typeof FamilyMemberSchema>;