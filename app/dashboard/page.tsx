import { auth } from '@/auth';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getEvents, getEventsCount } from '@/lib/queries/events';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';
import { buttonVariants } from '@/components/ui/button';
import EventsSection from './components/EventsSection';
import FamilySection from './components/FamilySection';
import WishListSection from './components/WishListSection';

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard for Family Gifts',
};

export default async function page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const events = await getEvents(3);
  const eventsCount = await getEventsCount();

  return (
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

      <div className="space-y-8">
        <WishListSection />
        <FamilySection />
        <EventsSection events={events} total={eventsCount} />
      </div>
    </div>
  );
}
