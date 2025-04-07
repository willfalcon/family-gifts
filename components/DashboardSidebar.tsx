import Link from 'next/link';
import { Gift, Home, List, MessagesSquare, Settings, UserPlus, Users } from 'lucide-react';
import { auth } from '@/auth';
import { buttonVariants } from './ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from './ui/sidebar';
import UserButton from './UserButton';
import { redirect } from 'next/navigation';

export default async function DashboardSidebar() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const nav = [
    { text: 'Dashboard', href: '/dashboard', icon: Home },
    { text: 'Families', href: '/dashboard/families', icon: Users },
    { text: 'Wish Lists', href: '/dashboard/wish-lists', icon: Gift },
    { text: 'Events', href: '/dashboard/events', icon: List },
    { text: 'Messages', href: '/dashboard/messages', icon: MessagesSquare },
    ...(session?.user ? [{ text: 'Manage Family', href: '/dashboard/manage-family', icon: UserPlus }] : []),
    { text: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Gift className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Family Gifts</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link className={buttonVariants({ variant: 'link', className: 'w-full !justify-start' })} href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.text}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
