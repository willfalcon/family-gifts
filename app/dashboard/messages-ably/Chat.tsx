import { Message } from 'ably';
import { useChannel } from 'ably/react';

import ChatWindow from './ChatWindow';
import { useMe } from '../Providers';
import { Reducer, useReducer } from 'react';
import { Channel } from '@prisma/client';
import { ActionTypes } from '@/hooks/use-messages';
import { MessageWithSender, OptimisticSend } from '@/prisma/types';

interface Action {
  name: ActionTypes;
  payload: MessageWithSender | OptimisticSend;
}

const reducer = (state: MessageWithSender[], action: Action) => {
  switch (action.name) {
    case ActionTypes.ADD:
      return [...state, action.payload];
    case ActionTypes.EDIT:
      return state.map((message) => (message.id === action.payload.id ? action.payload : message));
    case ActionTypes.DELETE:
      return state.filter((message) => message.id !== action.payload.id);
    default:
      return state;
  }
};
export default function Chat(props: { channel: Channel }) {
  // const [messages, setMessages] = useState<Message[]>([]);
  const [messages, dispatch] = useReducer<Reducer<MessageWithSender[], Action>>(reducer, []);
  const { publish } = useChannel(`chat:${props.channel.id}`, dispatch);

  const { data: me, isLoading } = useMe();

  const publishMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    // const input = form.elements.namedItem('message') as HTMLInputElement;
    const message = formData.get('message') as string;

    if (message.trim()) {
      publish({
        name: 'ADD',
        data: {
          text: message,
          timestamp: new Date().toLocaleString(),
          sender: me,
        },
      } as Message);
    }
  };
  return !isLoading && <ChatWindow channel={props.channel} messages={messages} handleSendMessage={publishMessage} />;
}
