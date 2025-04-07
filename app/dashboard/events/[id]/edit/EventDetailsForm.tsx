import { EventDetailsSchema } from '@/app/dashboard/events/eventSchema';

import { useForm } from 'react-hook-form';

import { EventDetailsSchemaType } from '@/app/dashboard/events/eventSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DateField from '@/app/dashboard/events/DateField';
import InfoField from '@/app/dashboard/events/InfoField';
import TimeField from '@/app/dashboard/events/TimeField';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventFromGetEvent } from '@/lib/queries/events';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { updateEventDetails } from '@/app/dashboard/events/actions';
import { toast } from 'sonner';

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
            <InfoField />
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
