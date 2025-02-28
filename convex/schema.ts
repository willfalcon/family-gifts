import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  channels: defineTable({
    name: v.string(),
    users: v.array(v.string()),
    type: v.union(v.literal('family'), v.literal('event'), v.literal('individual')),
    messages: v.array(v.id('messages')),
    family: v.optional(v.string()),
    event: v.optional(v.string()),
  }),
  messages: defineTable({
    channel: v.id('channels'),
    sender: v.string(),
    text: v.string(),
  }).index('by_channel', ['channel']),
});
