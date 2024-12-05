'use client';

// import { getActiveFamilyId } from "@/lib/rscUtils";
// import { getCookie } from 'cookies-next';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

import { QueryClient, QueryClientProvider, useQuery, UseQueryResult } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbsProvider } from '@/components/HeaderBreadcrumbs';

import { FamilyMemberWithUserManaging } from '@/prisma/types';

const queryClient = new QueryClient();

export default function Providers({ children, activeFamilyId }: PropsWithChildren & { activeFamilyId?: string }) {
  // const activeFamilyId = getCookie('activeFamilyId');
  const activeFamilyState = useState(activeFamilyId);

  return (
    <QueryClientProvider client={queryClient}>
      <ActiveFamilyContext.Provider value={activeFamilyState}>
        <MeProvider>
          <BreadcrumbsProvider>
            <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
          </BreadcrumbsProvider>
        </MeProvider>
      </ActiveFamilyContext.Provider>
    </QueryClientProvider>
  );
}
const ActiveFamilyContext = createContext<[string | undefined, Dispatch<SetStateAction<string | undefined>>]>(['', () => {}]);

export const useActiveFamilyContext = () => useContext(ActiveFamilyContext);

const MeProvider = ({ children }: PropsWithChildren) => {
  const queryRes = useQuery({
    queryKey: ['me'],
    queryFn: async () => fetch('/api/getActiveMemberUser').then((res) => res.json()),
  });

  return <MeContext.Provider value={queryRes}>{children}</MeContext.Provider>;
};

const MeContext = createContext<UseQueryResult<FamilyMemberWithUserManaging, Error>>({} as UseQueryResult<FamilyMemberWithUserManaging, Error>);

export const useMe = () => useContext(MeContext);
