import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateEventDetails } from '@/app/dashboard/events/actions';
import { EventDetailsSchema, type EventDetailsSchemaType } from '@/app/dashboard/events/eventSchema';
import { EventFromGetEvent } from '@/lib/queries/events';
import { cn } from '@/lib/utils';

import DateField from '@/app/dashboard/events/components/DateField';
import TimeField from '@/app/dashboard/events/components/TimeField';
import RichTextField from '@/components/RichTextField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Props = {
  event: EventFromGetEvent;
};
export default function EventDetailsForm({ event }: Props) {
  const form = useForm<EventDetailsSchemaType>({
    resolver: zodResolver(EventDetailsSchema),
    defaultValues: {
      name: event.name,
      date: event.date ?? undefined,
      time: event.time ?? undefined,
      location: event.location ?? '',
      info: JSON.parse(JSON.stringify(event.info || {})),
    },
  });
  const { mutate, isPending } = useMutation({
    async mutationFn(data: EventDetailsSchemaType) {
      return await updateEventDetails(event.id, {
        ...data,
        info: JSON.parse(JSON.stringify(data.info || {})),
        time: typeof data.time === 'string' ? new Date(data.time) : data.time,
      });
    },
    onSuccess(data) {
      console.log(data);
      toast.success(`${data.name} updated!`);
    },
  });

  async function onSubmit(values: EventDetailsSchemaType) {
    await mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', isPending && 'opacity-60 pointer-events-none')}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Basic information about your event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <RichTextField name="info" />
            <div className="grid grid-cols-2 gap-4">
              <DateField />
              <TimeField />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Details
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
