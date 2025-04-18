import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { markNotificationAsRead } from '@/app/dashboard/actions';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

import { Button } from '../ui/button';
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';

export default function SidebarNotifications() {
  const { data: session } = useSession();
  const unreadNotifications = useQuery(api.notifications.getUnreadNotifications, session?.user?.id ? { userId: session?.user?.id } : 'skip');
  const router = useRouter();

  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  return (
    <>
      <DropdownMenuLabel className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
          {unreadNotifications && unreadNotifications?.length > 0 && (
            <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">{unreadNotifications.length}</span>
          )}
        </div>
        {unreadNotifications?.length && unreadNotifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => markAllAsRead({ userId: session?.user?.id ?? '' })} className="h-auto text-xs py-1">
            Mark all as read
          </Button>
        )}
      </DropdownMenuLabel>
      {unreadNotifications && unreadNotifications?.length > 0 && (
        <>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[300px]">
            {unreadNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className={`flex flex-col items-start p-3 ${!notification.readAt ? 'bg-accent/50' : ''}`}
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                {notification.link ? (
                  <button
                    className="w-full"
                    onClick={() => {
                      markNotificationAsRead(notification._id);
                      router.push(notification.link!);
                    }}
                  >
                    <NotificationItem notification={notification} />
                  </button>
                ) : (
                  <div className="w-full">
                    <NotificationItem notification={notification} />
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </>
      )}
      <DropdownMenuItem>
        <Link href="/dashboard/notifications" className="flex">
          View all notifications
        </Link>
      </DropdownMenuItem>
    </>
  );
}

function NotificationItem({ notification }: { notification: Doc<'notifications'> }) {
  return (
    <>
      <div className="flex w-full justify-between gap-2">
        <span className="font-medium">{notification.title}</span>
        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification._creationTime), { addSuffix: true })}</span>
      </div>
      <p className="text-sm text-muted-foreground text-left">{notification.message}</p>
    </>
  );
}
