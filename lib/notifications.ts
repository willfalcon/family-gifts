'use server';

import { ConvexHttpClient } from 'convex/browser';

import { api } from '@/convex/_generated/api';
import { getMemberByEmail } from './queries/members';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type Notification = {
  email: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
};

export async function sendNotification(notification: Notification) {
  const user = await getMemberByEmail(notification.email);
  if (user) {
    const res = await client.mutation(api.notifications.createNotification, {
      userId: user.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
    });
    console.log('sendNotification: ', res);
    return res;
  }
  return null;
}
