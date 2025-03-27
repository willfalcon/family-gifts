import { auth } from '@/auth';
import Title from '@/components/Title';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { redirect } from 'next/navigation';
import DashboardUpcomingEvents from './components/DashboardUpcomingEvents';
import { getEvents, getEventsCount } from '@/lib/queries/events';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import FamilySection from './components/FamilySection';

export default async function page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // const activeFamily = await getActiveFamilyId();

  // const membersRes = await getSomeMembers(3);
  const eventsRes = await getEvents(3);
  const { count: eventsCount } = await getEventsCount();
  // const { success, message, family } = await getFamily();

  return (
    // <SidebarProvider defaultOpen={false} className="min-h-[500px]" style={{ ['--sidebar-width' as string]: '350px' }}>
    <div className="space-y-4 p-8 pt-6 relative w-full">
      <div className="container mx-auto px-4 py-8">
        <SetBreadcrumbs
          items={[
            {
              name: 'Dashboard',
              href: '/dashboard',
            },
          ]}
        />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <Title>Dashboard</Title>
            <p className="text-muted-foreground">Welcome back! Manage your families, events, and wish lists.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/wish-lists/new" className={buttonVariants()}>
              <Plus className="mr-2 h-4 w-4" />
              New Wish List
            </Link>
          </div>
        </div>

        <FamilySection />

        {/* <DashboardFamilyMembers {...membersRes} activeFamilyId={activeFamily ?? ''} /> */}

        {!!eventsRes.events.length && <DashboardUpcomingEvents {...eventsRes} total={eventsCount} />}
      </div>
      {/* <FloatingMessages /> */}
    </div>
    // {/* <MessagesSidebar familyId={family?.id} session={session} /> */}
    // </SidebarProvider>
  );
}
