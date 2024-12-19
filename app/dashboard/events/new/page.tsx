'use client';

import Title from '@/components/Title';
import { useForm } from 'react-hook-form';
import { EventSchema, EventSchemaType } from '../eventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaults } from '@/lib/utils';
import { createEvent } from '../actions';
import { toast } from 'sonner';
import EventForm from '../EventForm';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { useRouter } from 'next/navigation';

export default function NewEventPage() {
  const form = useForm<EventSchemaType>({
    resolver: zodResolver(EventSchema),
    defaultValues: getDefaults(EventSchema),
  });

  const router = useRouter();

  async function onSubmit(values: EventSchemaType) {
    console.log(values);
    try {
      const { event, success, message } = await createEvent({
        ...values,
        info: JSON.parse(JSON.stringify(values.info || {})),
        time: typeof values.time === 'string' ? new Date(values.time) : values.time,
      });
      if (success && event) {
        toast.success(`Created ${event.name}`);
        router.push(`/dashboard/event/${event.id}`);
      } else {
        console.log(event);
        toast.error(message);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Something went wrong.`);
    }
  }
  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Events', href: '/dashboard/events' },
          { name: 'New Event', href: '/dashboard/events/new' },
        ]}
      />
      <Title>New Event</Title>
      <EventForm form={form} onSubmit={onSubmit} submitText="Create Event" />
    </div>
  );
}
