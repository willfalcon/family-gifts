'use server';

import { v } from 'convex/values';

import { mutation, query, QueryCtx } from './_generated/server';

export const createNotification = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.union(v.literal('info'), v.literal('success'), v.literal('warning'), v.literal('error')),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db.insert('notifications', {
      userId: args.userId,
      title: args.title,
      message: args.message,
      type: args.type,
      link: args.link,
    });
  },
});

export const getNotifications = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return [];
    }
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
    return notifications;
  },
});

export const getUnreadNotifications = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await getUnreadNotificationsUtil(ctx, args.userId);
  },
});

export const getUnreadNotificationsCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unreads = await getUnreadNotificationsUtil(ctx, args.userId);
    return unreads.length;
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

async function getUnreadNotificationsUtil(ctx: QueryCtx, userId: string) {
  const notifications = await ctx.db
    .query('notifications')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .order('desc')
    .collect();
  return notifications.filter((notification) => !notification.readAt);
}

export const markAllAsRead = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const unreadNotifications = await getUnreadNotificationsUtil(ctx, args.userId);
    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        readAt: Date.now(),
      });
    }
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
