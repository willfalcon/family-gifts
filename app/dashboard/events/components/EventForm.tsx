import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { EventSchemaType } from '../eventSchema';

import RichTextField from '@/components/RichTextField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Attendees from './Attendees';
import DateField from './DateField';
import TimeField from './TimeField';

type EventFormProps = {
  form: UseFormReturn<EventSchemaType>;
  onSubmit: (data: EventSchemaType) => Promise<void>;
  submitText: string;
  pending?: boolean;
};

// TODO: Add location map features

export default function EventForm({ form, onSubmit, submitText, pending }: EventFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', pending && 'opacity-60 pointer-events-none')}>
        <Card>
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
                      <Input {...field} tabIndex={1} />
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
                      <Input {...field} tabIndex={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
        </Card>
        <Attendees />
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitText}
        </Button>
      </form>
    </Form>
  );
}
