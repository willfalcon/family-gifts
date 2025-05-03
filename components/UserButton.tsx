'use client';

import { useQuery } from 'convex/react';
import { ChevronsUpDown, UserCog, UserPlus } from 'lucide-react';
import { Session } from 'next-auth';
import Link from 'next/link';

import { api } from '@/convex/_generated/api';

import SignOut from './SignOut';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar';

import { userInitials } from '@/lib/utils';
import SidebarNotifications from './notifications/SidebarNotifications';

export default function UserButton({ session }: { session: Session }) {
  const { isMobile } = useSidebar();
  const unreadNotificationsCount = useQuery(api.notifications.getUnreadNotificationsCount, session.user?.id ? { userId: session.user?.id } : 'skip');
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    session.user?.image ?? `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`
                  }
                  alt={session.user?.name ?? ''}
                />
                <AvatarFallback>{userInitials(session.user?.name || '')}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{session.user?.name}</span>
                <span className="truncate text-xs">{session.user?.email}</span>
              </div>
              {unreadNotificationsCount && unreadNotificationsCount > 0 ? (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">{unreadNotificationsCount}</span>
              ) : (
                <ChevronsUpDown className="ml-auto size-4" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-96 min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'top'}
            align="start"
            // alignOffset={16}
            // sideOffset={16}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      session.user?.image ??
                      `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`
                    }
                    alt={session.user?.name ?? ''}
                    // alt={''}
                  />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{session.user?.name}</span>
                  <span className="truncate text-xs">{session.user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <SidebarNotifications />

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="/dashboard/manage-family" className="flex">
                  <UserPlus className="mr-2 h-4 w-4" /> <span>Manage Family</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/members/${session.user?.id}`} className="flex">
                  <UserCog className="mr-2 h-4 w-4" /> <span>Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
