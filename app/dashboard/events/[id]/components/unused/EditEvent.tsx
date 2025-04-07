'use client';

import { Event } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { EventSchema, EventSchemaType } from '../../../eventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEvent } from '../events/actions';
import { toast } from 'sonner';
import EventForm from '../../../EventForm';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EditEvent(event: Event) {
  const [open, setOpen] = useState(false);
  const form = useForm<EventSchemaType>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      ...event,
      date: event.date ?? undefined,
      time: event.time ?? undefined,
      location: event.location ?? '',
      info: JSON.parse(JSON.stringify(event.info || {})),
    },
  });
  async function onSubmit(values: EventSchemaType) {
    try {
      const {
        event: updatedEvent,
        success,
        message,
      } = await updateEvent(event?.id, {
        ...values,
        info: JSON.parse(JSON.stringify(values.info || {})),
        time: typeof values.time === 'string' ? new Date(values.time) : values.time,
      });
      if (success && updatedEvent) {
        toast.success(`Updated ${updatedEvent.name}`);
      } else {
        console.log(updatedEvent);
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
        <Button>Edit Event</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl pr-10">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-5">
          <EventForm form={form} onSubmit={onSubmit} submitText="Update Event" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
