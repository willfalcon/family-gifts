'use client';

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';

import { EventFromGetEvent } from '@/lib/queries/events';
import AttendeesForm from './AttendeesForm';
import EventDetailsForm from './EventDetailsForm';

export default function UpdateEvent({ event }: { event: EventFromGetEvent }) {
  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Events', href: '/dashboard/events' },
    { name: event.name, href: `/dashboard/events/${event.id}` },
    { name: 'Edit', href: `/dashboard/events/${event.id}/edit` },
  ]);

  return (
    <div>
      <EventDetailsForm event={event} />
      <AttendeesForm event={event} />
    </div>
  );
}
