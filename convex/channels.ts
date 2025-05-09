import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const getChannels = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const allChannels = await ctx.db.query('channels').collect();
    const filteredChannels = allChannels.filter((channel) => channel.users.includes(args.userId));
    if (!filteredChannels.length) {
      return 'no channels';
    }
    return filteredChannels;
  },
});

export const getChannel = query({
  args: {
    familyId: v.optional(v.string()),
    eventId: v.optional(v.string()),
    dmId: v.optional(v.string()),
    userId: v.optional(v.string()),
    anonymous: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.familyId) {
      const channels = await ctx.db
        .query('channels')
        .filter((q) => q.eq(q.field('family'), args.familyId))
        .take(1);
      return channels?.[0];
    }
    if (args.eventId) {
      const channels = await ctx.db
        .query('channels')
        .filter((q) => q.eq(q.field('event'), args.eventId))
        .take(1);
      return channels?.[0];
    }
    if (args.dmId && args.userId && args.anonymous) {
      const channels = await ctx.db
        .query('channels')
        .filter((q) => q.eq(q.field('type'), 'anonymous'))
        .collect();
      const channel = channels.find((channel) => channel.users.includes(args.dmId!) && channel.users.includes(args.userId!));
      return channel;
    }
    if (args.dmId && args.userId) {
      const channels = await ctx.db
        .query('channels')
        .filter((q) => q.eq(q.field('type'), 'individual'))
        .collect();
      const channel = channels.find((channel) => channel.users.includes(args.dmId!) && channel.users.includes(args.userId!));
      return channel;
    }
  },
});

export const createChannel = mutation({
  args: {
    name: v.string(),
    users: v.array(v.string()),
    type: v.union(v.literal('family'), v.literal('event'), v.literal('individual'), v.literal('anonymous')),
    messages: v.array(v.id('messages')),
    family: v.optional(v.string()),
    event: v.optional(v.string()),
    anonymousSender: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db.insert('channels', args);
    return channel;
  },
});

export const updateChannel = mutation({
  args: {
    channel: v.id('channels'),
    name: v.optional(v.string()),
    type: v.optional(v.union(v.literal('family'), v.literal('event'), v.literal('individual'), v.literal('anonymous'))),
    family: v.optional(v.string()),
    event: v.optional(v.string()),
    anonymousSender: v.optional(v.string()),
    users: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.channel, {
      ...(args.name && { name: args.name }),
      ...(args.type && { type: args.type }),
      ...(args.family && { family: args.family }),
      ...(args.event && { event: args.event }),
      ...(args.users && { users: args.users }),
      ...(args.anonymousSender && { anonymousSender: args.anonymousSender }),
    });
  },
});

export const addChannelUser = mutation({
  args: {
    user: v.string(),
    channel: v.optional(v.id('channels')),
    family: v.optional(v.string()),
    event: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    async function getChannel({ channel, family, event }: { channel?: Doc<'channels'>['_id']; family?: string; event?: string }) {
      if (channel) {
        return await ctx.db.get(channel);
      }
      if (family) {
        const channels = await ctx.db
          .query('channels')
          .filter((q) => q.eq(q.field('family'), family))
          .take(1);
        return channels?.[0];
      }
      if (event) {
        const channels = await ctx.db
          .query('channels')
          .filter((q) => q.eq(q.field('event'), event))
          .take(1);
        return channels?.[0];
      }
    }
    const channel = await getChannel(args);
    if (!channel) return;
    await ctx.db.patch(channel._id, { users: [...channel.users, args.user] });
  },
});

export const deleteChannel = mutation({
  args: {
    channel: v.optional(v.id('channels')),
    family: v.optional(v.string()),
    event: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    async function getChannel({ channel, family, event }: { channel?: Doc<'channels'>['_id']; family?: string; event?: string }) {
      if (channel) {
        return await ctx.db.get(channel);
      }
      if (family) {
        const channels = await ctx.db
          .query('channels')
          .filter((q) => q.eq(q.field('family'), family))
          .take(1);
        return channels?.[0];
      }
      if (event) {
        const channels = await ctx.db
          .query('channels')
          .filter((q) => q.eq(q.field('event'), event))
          .take(1);
        return channels?.[0];
      }
    }
    const channel = await getChannel(args);
    if (!channel) return;
    await ctx.db.delete(channel._id);
  },
});
