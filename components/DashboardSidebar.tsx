import Link from 'next/link';
import { Gift, List, Settings, UserPlus, Users } from 'lucide-react';
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
import FamilySelect from './FamilySelect';
import UserButton from './UserButton';
import { redirect } from 'next/navigation';
import { getFamilies } from '@/lib/queries/families';

export default async function DashboardSidebar() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { families } = await getFamilies();

  const nav = [
    { text: 'My Wish List', href: '/dashboard/wish-list', icon: Gift },
    { text: 'Family', href: '/dashboard/family', icon: Users },
    { text: 'Events', href: '/dashboard/events', icon: List },
    ...(session?.user ? [{ text: 'Manage Family', href: '/dashboard/manage-family', icon: UserPlus }] : []),
    { text: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <FamilySelect families={families} sidebar />
          </SidebarMenuItem>
        </SidebarMenu>
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
