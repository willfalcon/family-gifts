import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAllEvents } from '@/lib/queries/events';
import { Doc } from './_generated/dataModel';

export const getChannels = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const allChannels = await ctx.db.query('channels').collect();
    return allChannels.filter((channel) => channel.users.includes(args.userId));
  },
});

export const createChannel = mutation({
  args: {
    name: v.string(),
    users: v.array(v.string()),
    type: v.union(v.literal('family'), v.literal('event'), v.literal('individual')),
    messages: v.array(v.id('messages')),
    family: v.optional(v.string()),
    event: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db.insert('channels', args);
    return channel;
  },
});

export const addChannelUser = mutation({
  args: {
    user: v.string(),
    channel: v.optional(v.id('channels')),
    family: v.optional(v.string()),
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
