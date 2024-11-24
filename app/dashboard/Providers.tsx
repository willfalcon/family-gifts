'use client';

// import { getActiveFamilyId } from "@/lib/rscUtils";
// import { getCookie } from 'cookies-next';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbsProvider } from '@/components/HeaderBreadcrumbs';

const queryClient = new QueryClient();

export default function Providers({ children, activeFamilyId }: PropsWithChildren & { activeFamilyId?: string }) {
  // const activeFamilyId = getCookie('activeFamilyId');
  const activeFamilyState = useState(activeFamilyId);

  return (
    <QueryClientProvider client={queryClient}>
      <ActiveFamilyContext.Provider value={activeFamilyState}>
        <BreadcrumbsProvider>
          <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
        </BreadcrumbsProvider>
      </ActiveFamilyContext.Provider>
    </QueryClientProvider>
  );
}
const ActiveFamilyContext = createContext<[string | undefined, Dispatch<SetStateAction<string | undefined>>]>(['', () => {}]);

export const useActiveFamilyContext = () => useContext(ActiveFamilyContext);
