import { GetChannelReturnType } from '@/lib/queries/chat';
import { useReducer } from 'react';
import { toast } from 'sonner';

export enum ActionTypes {
  ADD = 'ADD',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
}

export function messagesReducer(
  state: GetChannelReturnType['messages'],
  action: {
    type: ActionTypes;
    payload: GetChannelReturnType['messages'][0] & {
      canDelete: boolean;
    };
  },
) {
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

export function useMessages(channel: GetChannelReturnType) {
  return useReducer(messagesReducer, channel?.messages || []);
}
