import { auth } from '@/auth';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getEvents } from '@/lib/queries/events';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import { buttonVariants } from '@/components/ui/button';
import EventsList from './components/EventsList';

export default async function EventsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Events', href: '/dashboard/events' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Events</Title>
          <SubTitle>Manage your gift-giving events</SubTitle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/events/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </div>
      </div>
      <EventsList upcomingEvents={events} />
    </div>
  );
}
