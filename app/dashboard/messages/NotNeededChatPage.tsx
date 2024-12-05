'use client';

import ChannelsList from './ChannelsList';
import Chat from './Chat';

import { Channel } from '@prisma/client';
// import { useChatContext } from './ChatProviders';
// import { ChannelProvider } from 'ably/react';

type ChatPageProps = {
  channels: Channel[];
};
export default function ChatPage({ channels }: ChatPageProps) {
  return (
    <div className="flex gap-4">
      <ChannelsList channels={channels} />
      <Chat channel={null} />
    </div>
  );
}
