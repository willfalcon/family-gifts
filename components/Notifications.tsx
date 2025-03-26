import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useMe } from '@/hooks/use-me';
import { useQuery } from 'convex/react';
import { createContext } from 'react';

type NotificationsContextType = {
  loading: boolean;
  notifications: Doc<'notifications'>[];
};

const defaultContextValue: NotificationsContextType = {
  loading: true,
  notifications: [],
};

const NotificationsContext = createContext<NotificationsContextType>(defaultContextValue);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  // const { isLoading, data: me } = useMe();
  const notifications = useQuery(api.notifications.getNotifications, {});
  const value = {
    loading: true,
    notifications: [],
  };
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};
