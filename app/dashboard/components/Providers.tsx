'use client';

import QueryClientProvider from '@/providers/QueryClientProvider';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

import { BreadcrumbsProvider } from '@/components/HeaderBreadcrumbs';
import { NotificationsProvider } from '@/components/notifications/Notifications';
import { SidebarProvider } from '@/components/ui/sidebar';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: PropsWithChildren) {
  // const activeFamilyId = getCookie('activeFamilyId');

  return (
    <SessionProvider>
      <QueryClientProvider>
        <ConvexProvider client={convex}>
          <NotificationsProvider>
            <BreadcrumbsProvider>
              <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
            </BreadcrumbsProvider>
          </NotificationsProvider>
        </ConvexProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
