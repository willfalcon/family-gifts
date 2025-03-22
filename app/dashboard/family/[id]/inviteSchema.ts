import { z } from 'zod';

export const InvitesSchema = z.object({
  invites: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .optional(),
});

export type InvitesSchemaType = z.infer<typeof InvitesSchema>;
