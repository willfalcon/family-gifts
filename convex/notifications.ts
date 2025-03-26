import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createNotification = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.union(v.literal('info'), v.literal('success'), v.literal('warning'), v.literal('error')),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('notifications', {
      userId: args.userId,
      title: args.title,
      message: args.message,
      type: args.type,
      link: args.link,
      createdAt: Date.now(),
    });
  },
});

export const getNotifications = query({
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query('notifications')
      // .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
    return notifications;
  },
});

export const markNotificationAsRead = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      readAt: Date.now(),
    });
  },
});

export const deleteNotification = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
  },
});
