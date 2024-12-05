import { ChannelWithMessages, MessageWithSender, OptimisticSend } from '@/prisma/types';
import { useReducer } from 'react';
import { toast } from 'sonner';

export enum ActionTypes {
  ADD = 'ADD',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
}

type BasePayload = MessageWithSender | OptimisticSend;
interface Action {
  type: ActionTypes;
  payload: BasePayload & { canDelete?: boolean };
}

export function messagesReducer(state: (MessageWithSender | OptimisticSend)[], action: Action) {
  switch (action.type) {
    case ActionTypes.ADD:
      return [...state, action.payload];
    case ActionTypes.EDIT:
      return state.map((message) => (message.id === action.payload.id ? action.payload : message));
    case ActionTypes.DELETE:
      if (action.payload.canDelete) {
        return state.filter((message) => message.id !== action.payload.id);
      }
      toast.error('You cannot delete this message.');
      return state;
    default:
      return state;
  }
}

export function useMessages(channel: ChannelWithMessages | null) {
  return useReducer(messagesReducer, channel?.messages || []);
}
