import { PropsWithChildren } from 'react';

import DashboardSidebar from '@/components/DashboardSidebar';
import Header from '@/components/Header';
import { SidebarInset } from '@/components/ui/sidebar';
import Providers from './components/Providers';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      {/* <div className="flex h-full min-h-screen w-full flex-col"> */}
      <DashboardSidebar />
      <SidebarInset>
        <div className="flex flex-col">
          <Header />
          <div className="flex-1">{children}</div>
        </div>
      </SidebarInset>
    </Providers>
  );
}
