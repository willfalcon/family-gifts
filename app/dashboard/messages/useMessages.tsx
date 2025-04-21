import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import { useMutation, useQuery } from 'convex/react';

type Props = {
  channelId: Id<'channels'> | undefined;
  userId: string;
};

export default function useMessages({ channelId, userId }: Props) {
  const messages = useQuery(api.messages.getMessages, { channelId: channelId });
  const lastReadTime = useQuery(api.lastReads.getLastReadTime, { userId: userId, channelId: channelId });
  const setLastRead = useMutation(api.lastReads.setLastRead);
  const sendMessage = useMutation(api.messages.sendMessage);
  const orderedMessages = messages ? [...messages].reverse() : [];
  const newestMessage = orderedMessages[orderedMessages.length - 1];
  const hasUnreadMessages = messages?.length
    ? lastReadTime
      ? orderedMessages.some((message) => new Date(lastReadTime) < new Date(message._creationTime))
      : true
    : false;

  return {
    messages,
    lastReadTime,
    setLastRead,
    sendMessage,
    orderedMessages,
    newestMessage,
    hasUnreadMessages,
  };
}
