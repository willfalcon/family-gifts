'use client';

import ChatWindow, { userCanDelete } from '@/components/Messages/ChatWindow';

import { ChannelWithMessages, FamilyMemberWithUser, FamilyMemberWithUserManaging, MessageWithSender, OptimisticSend } from '@/prisma/types';
import { toast } from 'sonner';
// import { postMessage } from './actions';
// import { useEffect } from 'react';

import { createId } from '@paralleldrive/cuid2';
import { ActionTypes, useMessages } from '@/hooks/use-messages';
import { useChannel } from 'ably/react';

interface ChatProps {
  channel: ChannelWithMessages;
  me: FamilyMemberWithUserManaging;
  sidebar?: boolean;
}

export default function Chat({ channel, me, sidebar = false }: ChatProps) {
  const [messages, dispatch] = useMessages(channel);

  const { publish } = useChannel(`chat:${channel.id}`, (message) => {
    dispatch({
      type: message.name as ActionTypes,
      payload: message.data,
    });
  });

  const publishMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = formData.get('message') as string;
    if (message.trim()) {
      // send message

      try {
        const optimisticSend: OptimisticSend = {
          id: createId(),
          sender: me,
          channel,
          text: message,
          createdAt: new Date(),
        };
        publish({
          name: ActionTypes.ADD,
          data: optimisticSend,
        });

        form.reset();
        // const { success, message: info, sent } = await postMessage(channel.id, message);
        // if (success && sent) {
        //   console.log(sent);
        // } else {
        //   toast.error(info);
        //   dispatch({
        //     type: ActionTypes.DELETE,
        //     payload: optimisticSend,
        //   });
        // }
      } catch (err) {
        console.error(err);
        toast.error(`Couldn't send message.`);
      }
    }
  };

  const deleteMessage = (message: OptimisticSend) => {
    publish({
      name: ActionTypes.DELETE,
      data: { ...message, canDelete: userCanDelete(channel, message.sender, me) },
    });
  };

  return <ChatWindow channel={channel} messages={messages} handleSendMessage={publishMessage} onDelete={deleteMessage} sidebar={sidebar} />;
}
