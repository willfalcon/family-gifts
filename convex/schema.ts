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
  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.union(v.literal('info'), v.literal('success'), v.literal('warning'), v.literal('error')),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
    link: v.optional(v.string()),
  }).index('by_user', ['userId']),
});
