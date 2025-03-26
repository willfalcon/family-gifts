'use client';

// import { getActiveFamilyId } from "@/lib/rscUtils";
// import { getCookie } from 'cookies-next';
import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbsProvider } from '@/components/HeaderBreadcrumbs';

import { SessionProvider } from 'next-auth/react';
import { NotificationsProvider } from '@/components/Notifications';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: PropsWithChildren) {
  // const activeFamilyId = getCookie('activeFamilyId');

  const queryClient = getQueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
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
