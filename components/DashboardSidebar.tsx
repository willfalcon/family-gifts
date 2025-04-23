import { auth } from '@/auth';
import { Bell, CalendarDays, Gift, Home, MessagesSquare, Settings, User, Users } from 'lucide-react';
import { redirect } from 'next/navigation';

import Logo from './Logo';
import SidebarItem from './SidebarItem';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from './ui/sidebar';
import UserButton from './UserButton';

export default async function DashboardSidebar() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const nav = [
    { text: 'Dashboard', href: '/dashboard', icon: <Home className="mr-2 h-4 w-4" /> },
    { text: 'Families', href: '/dashboard/families', icon: <Users className="mr-2 h-4 w-4" /> },
    { text: 'Members', href: '/dashboard/members', icon: <User className="mr-2 h-4 w-4" /> },
    { text: 'Wish Lists', href: '/dashboard/wish-lists', icon: <Gift className="mr-2 h-4 w-4" /> },
    { text: 'Events', href: '/dashboard/events', icon: <CalendarDays className="mr-2 h-4 w-4" /> },
    { text: 'Messages', href: '/dashboard/messages', icon: <MessagesSquare className="mr-2 h-4 w-4" /> },
    { text: 'Notifications', href: '/dashboard/notifications', icon: <Bell className="mr-2 h-4 w-4" /> },
    { text: 'Settings', href: '/dashboard/settings', icon: <Settings className="mr-2 h-4 w-4" /> },
  ];

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarItem key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
