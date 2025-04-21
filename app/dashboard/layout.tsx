import { PropsWithChildren } from 'react';

import DashboardSidebar from '@/components/DashboardSidebar';
import Header from '@/components/Header';
import { SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import Providers from './components/Providers';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      {/* <div className="flex h-full min-h-screen w-full flex-col"> */}
      <DashboardSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        {/* <div className="flex flex-col min-h-screen"> */}
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="py-6 px-4 border-t mt-auto">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Family Gifts. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
        {/* </div> */}
      </SidebarInset>
    </Providers>
  );
}
