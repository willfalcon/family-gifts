'use client';

import { useQuery } from 'convex/react';
import { Session } from 'next-auth';

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';
import { api } from '@/convex/_generated/api';

import { ChannelListSkeleton, ChatSkeleton } from '@/components/messages/ChatSkeleton';
import Title from '@/components/Title';
import ChannelsList from './ChannelsList';
import Chat from './Chat';

type Props = {
  session: Session;
  channelId?: string;
};

export default function Messages({ session, channelId }: Props) {
  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Messages', href: '/dashboard/messages' },
  ]);

  const channels = useQuery(api.channels.getChannels, { userId: session.user!.id! });
  const channel = channelId ? channels?.find((channel) => channel._id === channelId) : null;
  // const channels = false;
  // const channel = false;
  return (
    <div className="space-y-4 p-8 pt-6">
      <Title>Messages</Title>
      <div className="flex gap-4">
        {channels ? <ChannelsList channels={channels} activeChannel={channelId} /> : <ChannelListSkeleton />}
        {channel ? <Chat channel={channel} user={session.user!.id!} /> : <ChatSkeleton />}
      </div>
    </div>
  );
}
