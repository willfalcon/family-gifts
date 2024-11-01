import Header from '@/components/Header';
import { PropsWithChildren } from 'react';
import Providers from './Providers';
import DashboardSidebar from '@/components/DashboardSidebar';
import { SidebarInset } from '@/components/ui/sidebar';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      {/* <div className="flex h-full min-h-screen w-full flex-col"> */}
      <DashboardSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1">
          <main className="flex-1 p-6">{children}</main>
        </div>
      </SidebarInset>
    </Providers>
  );
}
