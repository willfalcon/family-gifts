'use client';

import { useQuery } from 'convex/react';
import { Session } from 'next-auth';

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';
import { api } from '@/convex/_generated/api';
import { useIsMobile } from '@/hooks/use-mobile';

import { ChannelListSkeleton } from '@/components/Messages/ChatSkeleton';
import Title from '@/components/Title';
import { Doc } from '@/convex/_generated/dataModel';
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
  const channel = channelId && channels !== 'no channels' ? channels?.find((channel) => channel._id === channelId) : null;

  const mobile = useIsMobile();
  const channelsLoading = !channels && channels !== 'no channels';
  return (
    <div className="space-y-4 p-4 lg:p-8 pt-6">
      <Title>Messages</Title>
      <div className="flex gap-4">
        {channelsLoading && <ChannelListSkeleton />}
        {!channelsLoading && channels && !(mobile && channel) && <ChannelsList channels={channels as Doc<'channels'>[]} activeChannel={channelId} />}
        {channel && <Chat channel={channel} user={session.user!.id!} />}
      </div>
    </div>
  );
}
