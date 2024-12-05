import { Dispatch, Reducer, useReducer, useState } from 'react';

import { useChannel } from 'ably/react';
import ChatWindow from './ChatWindow';
import { useMe } from '../Providers';
import { Channel, FamilyMember } from '@prisma/client';

const ADD = 'ADD';

enum ActionNames {
  ADD = 'ADD',
  DELETE = 'DELETE',
}

interface MessageEvent {
  name: ActionNames;
  id: string;
  data: {
    text: string;
    timestamp: string;
    sender: FamilyMember;
  };
}

const reducer = (state: MessageEvent[], action: MessageEvent) => {
  console.log(event);
  switch (event.name) {
    case ADD:
      return [...prev, event];
  }
};

function initMessages(messages) {
  return messages;
}
export default function Chat(props: { channel: Channel }) {
  const [messages, dispatch] = useReducer(reducer, channel.messages || [], initMessages);

  console.log(messages);

  const { channel, publish } = useChannel(props.channel.id, dispatch);
  const { data: me, isLoading } = useMe();

  const publishMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    // const input = form.elements.namedItem('message') as HTMLInputElement;
    const message = formData.get('message') as string;
    console.log(message);
    if (message.trim()) {
      publish({
        name: ADD,
        data: {
          text: message,
          timestamp: new Date().toLocaleString(),
          sender: me,
        },
      });
    }
  };
  return !isLoading && <ChatWindow channel={channel} messages={messages} handleSendMessage={publishMessage} />;
}
