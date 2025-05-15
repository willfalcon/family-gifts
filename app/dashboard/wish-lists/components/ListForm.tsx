import { UseFormReturn } from 'react-hook-form';

import { ListSchemaType } from '../listSchema';

import RichTextField from '@/components/RichTextField';
import SubmitButton from '@/components/SubmitButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CategoriesField from './CategoriesField';
import Visibility from './Visibility';

type ListFormProps = {
  form: UseFormReturn<ListSchemaType>;
  onSubmit: (data: ListSchemaType) => Promise<void>;
  submitText: string;
  shareLinkId?: string | null;
};

// TODO: Visibility setting not being applied, no events in list.

export default function ListForm({ form, onSubmit, submitText, shareLinkId }: ListFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>List Details</CardTitle>
            <CardDescription>Provide basic information about the list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} tabIndex={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <RichTextField name="description" />
          </CardContent>
        </Card>

        <Visibility shareLinkId={shareLinkId} />

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Create categories to organize your items.</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoriesField />
          </CardContent>
        </Card>

        <SubmitButton>{submitText}</SubmitButton>
      </form>
    </Form>
  );
}
