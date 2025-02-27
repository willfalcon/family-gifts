'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EventSchema, EventSchemaType } from './eventSchema';
import { getDefaults } from '@/lib/utils';
import EventForm from './EventForm';
import { createEvent } from './actions';
import { toast } from 'sonner';

export default function CreateEvent() {
  const [open, setOpen] = useState(false);

  const form = useForm<EventSchemaType>({
    resolver: zodResolver(EventSchema),
    defaultValues: getDefaults(EventSchema),
  });

  async function onSubmit(values: EventSchemaType) {
    try {
      const { event, success, message } = await createEvent(values);
      if (success && event) {
        toast.success(`Created ${event.name}`);
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            The thing yells at me if I don&apos;t put a description here for accessibility reasons but this is, like the title says, where you make an
            event.
          </DialogDescription>
        </DialogHeader>
        <EventForm form={form} onSubmit={onSubmit} submitText="Create Event" />
      </DialogContent>
    </Dialog>
  );
}
