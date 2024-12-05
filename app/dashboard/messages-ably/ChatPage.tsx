'use client';

import ChannelsList from './ChannelsList';
import Chat from './Chat';

import { Channel } from '@prisma/client';
import { useChatContext } from './ChatProviders';
import { ChannelProvider } from 'ably/react';

type ChatPageProps = {
  channels: Channel[];
};
export default function ChatPage({ channels }: ChatPageProps) {
  const [channel] = useChatContext();

  return (
    <div className="flex gap-4">
      <ChannelsList channels={channels} />
      {channel && (
        <ChannelProvider channelName={`chat:${channel.id}`}>
          <Chat channel={channel} />
        </ChannelProvider>
      )}
    </div>
  );
}
