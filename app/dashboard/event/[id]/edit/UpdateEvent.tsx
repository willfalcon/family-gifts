'use client';

import { EventDetailsSchema, EventDetailsSchemaType } from '@/app/dashboard/events/eventSchema';

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventFromGetEvent } from '@/lib/queries/events';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateEventDetails } from '@/app/dashboard/events/actions';
import EventDetailsForm from './EventDetailsForm';
import AttendeesForm from './AttendeesForm';
export default function UpdateEvent({ event }: { event: EventFromGetEvent }) {
  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Events', href: '/dashboard/events' },
    { name: event.name, href: `/dashboard/event/${event.id}` },
    { name: 'Edit', href: `/dashboard/event/${event.id}/edit` },
  ]);

  return (
    <div>
      <EventDetailsForm event={event} />
      <AttendeesForm event={event} />
    </div>
  );
}
