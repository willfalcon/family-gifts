import { UseFormReturn } from 'react-hook-form';
import { EventSchemaType } from './eventSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DateField from './DateField';
import InfoField from './InfoField';

type EventFormProps = {
  form: UseFormReturn<EventSchemaType>;
  onSubmit: (data: EventSchemaType) => Promise<void>;
  submitText: string;
};

// TODO: Add location map features

export default function EventForm({ form, onSubmit, submitText }: EventFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <DateField />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => {
            const timeString = field.value ? (typeof field.value === 'string' ? field.value : field.value.toLocaleTimeString()) : '';

            return (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" value={timeString} onChange={(e) => field.onChange(new Date(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
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
        <InfoField />
        <Button type="submit">{submitText}</Button>
      </form>
    </Form>
  );
}
