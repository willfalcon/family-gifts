import { z } from 'zod';

export const ProfileSchema = z.object({
  name: z.string().min(1).default(''),
  email: z.string().email().default(''),
  info: z.any().optional(),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
