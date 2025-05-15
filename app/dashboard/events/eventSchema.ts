import { z } from 'zod';

export const EventSchema = z.object({
  name: z.string().min(1).default(''),
  date: z.date().optional(),
  time: z.date().optional(),
  location: z.string().optional().default(''),
  info: z.any().optional(),
  attendees: z.array(z.string()).default([]),
  externalInvites: z.array(z.string()).default([]),
  familyId: z.string().optional(),
});

export type EventSchemaType = z.infer<typeof EventSchema>;

export const EventDetailsSchema = EventSchema.pick({
  name: true,
  date: true,
  time: true,
  location: true,
  info: true,
});

export type EventDetailsSchemaType = z.infer<typeof EventDetailsSchema>;

export const EventAttendeesSchema = EventSchema.pick({
  attendees: true,
  externalInvites: true,
  familyId: true,
});

export type EventAttendeesSchemaType = z.infer<typeof EventAttendeesSchema>;
