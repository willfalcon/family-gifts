'use client';

import { useNotifications } from '@/components/Notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, ExternalLink, Trash2 } from 'lucide-react';
import { deleteNotification, markNotificationAsRead } from '../actions';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export default function NotificationsPage() {
  const { notifications, unreadNotifications } = useNotifications();
  const getNotificationTypeClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        {notifications?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
            <p className="mt-2 text-sm text-muted-foreground">You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notifications?.map((notification) => (
              <Card key={notification._id} className={cn(notification.readAt ? '' : 'border-1-4 border-1-blue-500')}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1.5 h-3 w-3 flex-shrink-0 rounded-full ${getNotificationTypeClass(notification.type)}`} />
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">{notification.message}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification._creationTime))}</div>
                        {notification.link && (
                          <Link href={notification.link} className="mt-2 inline-flex items-center gap-1 text-xs text-blue-500 hover:underline">
                            View details <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.readAt && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markNotificationAsRead(notification._id)}
                          className="h-8 w-8 p-0"
                          aria-label="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" aria-label="Delete notification">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteNotification(notification._id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="unread">
        {unreadNotifications?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No unread notifications</h3>
            <p className="mt-2 text-sm text-muted-foreground">You don't have any unread notifications yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {unreadNotifications?.map((notification) => (
              <Card key={notification._id} className={cn(notification.readAt ? '' : 'border-l-4 border-l-blue-500')}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1.5 h-3 w-3 flex-shrink-0 rounded-full ${getNotificationTypeClass(notification.type)}`} />
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">{notification.message}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification._creationTime))}</div>
                        {notification.link && (
                          <Link href={notification.link} className="mt-2 inline-flex items-center gap-1 text-xs text-blue-500 hover:underline">
                            View details <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.readAt && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markNotificationAsRead(notification._id)}
                          className="h-8 w-8 p-0"
                          aria-label="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" aria-label="Delete notification">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteNotification(notification._id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
