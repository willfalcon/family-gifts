import { z } from 'zod';

export const EventSchema = z.object({
  name: z.string().min(1).default(''),
  date: z.date().optional(),
  info: z.any().optional(),
  location: z.string().optional().default(''),
});

export type EventSchemaType = z.infer<typeof EventSchema>;
