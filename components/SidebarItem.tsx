'use client';

import Link from 'next/link';

import { useIsMobile } from '@/hooks/use-mobile';
import { buttonVariants } from './ui/button';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar';

type Props = {
  item: {
    text: string;
    href: string;
    icon: React.ReactNode;
  };
};

export default function SidebarItem({ item }: Props) {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  return (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton asChild onClick={() => isMobile && toggleSidebar()}>
        <Link className={buttonVariants({ variant: 'link', className: 'w-full !justify-start' })} href={item.href}>
          {item.icon}
          <span>{item.text}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
