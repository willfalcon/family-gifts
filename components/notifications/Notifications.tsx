import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useSession } from 'next-auth/react';
import { createContext, useContext } from 'react';

type NotificationsContextType = {
  // loading: boolean;
  notifications: Doc<'notifications'>[] | undefined;
  unreadNotifications: Doc<'notifications'>[] | undefined;
};

const defaultContextValue: NotificationsContextType = {
  // loading: true,
  notifications: [],
  unreadNotifications: [],
};

const NotificationsContext = createContext<NotificationsContextType>(defaultContextValue);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const notifications = useQuery(api.notifications.getNotifications, session?.user?.id ? { userId: session?.user?.id } : 'skip');
  const unreadNotifications = notifications?.filter((notification) => !notification.readAt);
  const value = {
    notifications,
    unreadNotifications,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
