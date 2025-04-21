import { auth } from '@/auth';
import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getEvents, getEventsCount } from '@/lib/queries/events';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DashboardUpcomingEvents from './components/DashboardUpcomingEvents';
import FamilySection from './components/FamilySection';
import WishListSection from './components/WishListSection';

export default async function page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // const activeFamily = await getActiveFamilyId();

  // const membersRes = await getSomeMembers(3);
  const events = await getEvents(3);
  const eventsCount = await getEventsCount();
  // const { success, message, family } = await getFamily();
  // TODO: show families where user is waiting approval

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

        <div className="grid md:grid-cols-2 gap-4">
          <FamilySection />

          {!!events.length ? (
            <DashboardUpcomingEvents events={events} total={eventsCount} />
          ) : (
            <Card className="border-dashed flex flex-col items-center justify-center p-8">
              <Calendar className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="font-medium text-center mb-2">Plan an Event</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">Create an event and invite people</p>

              <Link href="/dashboard/events/new" className={buttonVariants()}>
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Link>
            </Card>
          )}

          <WishListSection />
        </div>
      </div>
    </div>
  );
}
