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
        <InfoField />
        <Button type="submit">{submitText}</Button>
      </form>
    </Form>
  );
}
