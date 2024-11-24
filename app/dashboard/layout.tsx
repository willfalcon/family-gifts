import Header from '@/components/Header';
import { PropsWithChildren } from 'react';
import Providers from './Providers';
import DashboardSidebar from '@/components/DashboardSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { getActiveFamilyId } from '@/lib/rscUtils';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const activeFamilyId = await getActiveFamilyId();
  return (
    <Providers activeFamilyId={activeFamilyId}>
      {/* <div className="flex h-full min-h-screen w-full flex-col"> */}
      <DashboardSidebar />
      <SidebarInset>
        <Header />
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </Providers>
  );
}
