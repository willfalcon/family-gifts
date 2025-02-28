'use client';

// import { getActiveFamilyId } from "@/lib/rscUtils";
// import { getCookie } from 'cookies-next';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

import { QueryClient, QueryClientProvider, useQuery, UseQueryResult } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbsProvider } from '@/components/HeaderBreadcrumbs';

import { FamilyMemberWithAll } from '@/prisma/types';

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

export default function Providers({ children, activeFamilyId }: PropsWithChildren & { activeFamilyId?: string }) {
  // const activeFamilyId = getCookie('activeFamilyId');
  const activeFamilyState = useState(activeFamilyId);
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ConvexProvider client={convex}>
        <ActiveFamilyContext.Provider value={activeFamilyState}>
          <MeProvider>
            <BreadcrumbsProvider>
              <SidebarProvider defaultOpen={true}>
                {children}
              </SidebarProvider>
            </BreadcrumbsProvider>
          </MeProvider>
        </ActiveFamilyContext.Provider>
      </ConvexProvider>
    </QueryClientProvider>
  );
}
const ActiveFamilyContext = createContext<[string | undefined, Dispatch<SetStateAction<string | undefined>>]>(['', () => {}]);

export const useActiveFamilyContext = () => useContext(ActiveFamilyContext);

const MeProvider = ({ children }: PropsWithChildren) => {
  const queryRes = useQuery({
    queryKey: ['me'],
    queryFn: async () => fetch('/api/getActiveMemberAll').then((res) => res.json()),
  });

  return <MeContext.Provider value={queryRes}>{children}</MeContext.Provider>;
};

const MeContext = createContext<UseQueryResult<FamilyMemberWithAll, Error>>({} as UseQueryResult<FamilyMemberWithAll, Error>);

export const useMe = () => useContext(MeContext);
