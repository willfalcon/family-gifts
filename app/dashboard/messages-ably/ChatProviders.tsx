'use client';

import { Channel } from '@prisma/client';
import * as Ably from 'ably';
import { AblyProvider } from 'ably/react';
import { createContext, ReactNode, Dispatch, SetStateAction, useContext, useState } from 'react';

export default function ChatProviders({ children, defaultChannel }: { children: ReactNode; defaultChannel: Channel }) {
  const client = new Ably.Realtime({ authUrl: '/api/chat', autoConnect: typeof window !== 'undefined' });
  const channelState = useState(defaultChannel);
  return (
    <AblyProvider client={client}>
      <ChatContext.Provider value={channelState}>{children}</ChatContext.Provider>
    </AblyProvider>
  );
}

type ChannelState = [Channel, Dispatch<SetStateAction<Channel>>];

const ChatContext = createContext<ChannelState>({} as ChannelState);

export const useChatContext = () => useContext(ChatContext);
