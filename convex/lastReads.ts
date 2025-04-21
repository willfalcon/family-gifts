import { v } from 'convex/values';

import { Doc } from './_generated/dataModel';
import { mutation, query, QueryCtx } from './_generated/server';

async function getLastReadUtil(ctx: QueryCtx, userId: string, channelId: Doc<'channels'>['_id']) {
  const lastReads = await ctx.db
    .query('lastReads')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .collect();
  const lastReadMessage = lastReads.find((read) => read.channel === channelId);
  return lastReadMessage;
}

export const getLastRead = query({
  args: {
    userId: v.string(),
    channelId: v.id('channels'),
  },
  handler: async (ctx, args) => {
    return await getLastReadUtil(ctx, args.userId, args.channelId);
  },
});

export const getLastReadTime = query({
  args: {
    userId: v.string(),
    channelId: v.optional(v.id('channels')),
  },
  handler: async (ctx, args) => {
    if (!args.channelId) {
      return null;
    }
    const lastRead = await getLastReadUtil(ctx, args.userId, args.channelId);
    if (!lastRead) {
      return null;
    }
    const message = await ctx.db.get(lastRead.lastRead);
    return message?._creationTime;
  },
});

export const setLastRead = mutation({
  args: {
    userId: v.string(),
    channelId: v.id('channels'),
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const lastRead = await getLastReadUtil(ctx, args.userId, args.channelId);
    if (lastRead) {
      const newLastRead = await ctx.db.patch(lastRead._id, {
        lastRead: args.messageId,
      });
      return newLastRead;
    } else {
      const newLastRead = await ctx.db.insert('lastReads', {
        userId: args.userId,
        channel: args.channelId,
        lastRead: args.messageId,
      });
      return newLastRead;
    }
  },
});
