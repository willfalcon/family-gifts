import { z } from 'zod';

export const EventSchema = z.object({
  name: z.string().min(1).default(''),
  date: z.date().optional(),
  time: z.date().optional(),
  location: z.string().optional().default(''),
  info: z.any().optional(),
  attendees: z.array(z.string()).default([]),
  externalInvites: z.array(z.string()).default([]),
});

export type EventSchemaType = z.infer<typeof EventSchema>;
