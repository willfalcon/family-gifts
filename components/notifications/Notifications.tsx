import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { ReactMutation, useMutation, useQuery } from 'convex/react';
import { FunctionReference } from 'convex/server';
import { useSession } from 'next-auth/react';
import { createContext, useContext } from 'react';

type MarkAsRead = ReactMutation<
  FunctionReference<
    'mutation',
    'public',
    {
      notificationId: Id<'notifications'>;
    },
    null,
    string | undefined
  >
> | null;

type MarkAllAsRead = ReactMutation<FunctionReference<'mutation', 'public', { userId: string }, null, string | undefined>> | null;

type NotificationsContextType = {
  // loading: boolean;
  notifications: Doc<'notifications'>[] | undefined;
  unreadNotifications: Doc<'notifications'>[] | undefined;
  markAsRead: MarkAsRead;
  markAllAsRead: MarkAllAsRead;
};

const defaultContextValue: NotificationsContextType = {
  // loading: true,
  notifications: [],
  unreadNotifications: [],
  markAsRead: null,
  markAllAsRead: null,
};

const NotificationsContext = createContext<NotificationsContextType>(defaultContextValue);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const notifications = useQuery(api.notifications.getNotifications, session?.user?.id ? { userId: session?.user?.id } : 'skip');
  const unreadNotifications = notifications?.filter((notification) => !notification.readAt);
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const value = {
    notifications,
    unreadNotifications,
    markAsRead,
    markAllAsRead,
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
