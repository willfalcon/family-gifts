import { UseFormReturn } from 'react-hook-form';
import { EventSchemaType } from './eventSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DateField from './DateField';
import InfoField from './InfoField';
import TimeField from './TimeField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Attendees from './Attendees';

type EventFormProps = {
  form: UseFormReturn<EventSchemaType>;
  onSubmit: (data: EventSchemaType) => Promise<void>;
  submitText: string;
};

// TODO: Add location map features

export default function EventForm({ form, onSubmit, submitText }: EventFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        </Card>
        <Attendees />
        <Button type="submit">{submitText}</Button>
      </form>
    </Form>
  );
}
