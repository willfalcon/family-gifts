import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { FamilySchemaType } from './familySchema';

type FamilyFormProps = {
  form: UseFormReturn<FamilySchemaType>;
  onSubmit: (data: FamilySchemaType) => Promise<void>;
  submitText: string;
};

export default function FamilyForm({ form, onSubmit, submitText }: FamilyFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => {
            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }} 
        />
        <Button type="submit">{submitText}</Button>
      </form>
    </Form>
  );
}
