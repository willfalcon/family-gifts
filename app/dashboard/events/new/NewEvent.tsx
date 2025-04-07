'use client';

import { useForm } from 'react-hook-form';
import { EventSchema, EventSchemaType } from '../eventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaults } from '@/lib/utils';
import { createEvent } from '../actions';
import { toast } from 'sonner';
import EventForm from '../EventForm';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';

export default function NewEvent() {
  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Events', href: '/dashboard/events' },
    { name: 'New Event', href: '/dashboard/events/new' },
  ]);
  const form = useForm<EventSchemaType>({
    resolver: zodResolver(EventSchema),
    defaultValues: getDefaults(EventSchema),
  });

  const router = useRouter();

  const mutation = useMutation({
    async mutationFn(data: EventSchemaType) {
      // console.log(data);
      return await createEvent({
        ...data,
        info: JSON.parse(JSON.stringify(data.info || {})),
        time: typeof data.time === 'string' ? new Date(data.time) : data.time,
      });
    },
    onSuccess(data) {
      console.log(data);
      toast.success(`${data.name} created!`);
      router.push(`/dashboard/events/${data.id}`);
    },
  });

  async function onSubmit(values: EventSchemaType) {
    await mutation.mutate(values);
  }

  return <EventForm form={form} onSubmit={onSubmit} submitText="Create Event" pending={mutation.isPending} />;
}
