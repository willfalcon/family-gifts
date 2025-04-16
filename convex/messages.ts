import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getMessages = query({
  args: {
    channelId: v.id('channels'),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_channel', (q) => q.eq('channel', args.channelId))
      .take(10);
    return messages;
  },
});

export const sendMessage = mutation({
  args: {
    user: v.string(),
    text: v.string(),
    channel: v.id('channels'),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.insert('messages', {
      channel: args.channel,
      sender: args.user,
      text: args.text,
    });
    return message;
  },
});

export const deleteMessage = mutation({
  args: {
    message: v.id('messages'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.message);
  },
});
