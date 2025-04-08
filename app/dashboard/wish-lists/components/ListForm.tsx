import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SubmitButton from '@/components/SubmitButton';

import { ListSchemaType } from '../listSchema';
import Visibility from './Visibility';
import CategoriesField from './CategoriesField';
import RichTextField from '@/components/RichTextField';

type ListFormProps = {
  form: UseFormReturn<ListSchemaType>;
  onSubmit: (data: ListSchemaType) => Promise<void>;
  submitText: string;
  shareLinkId?: string | null;
};

// TODO: swap out getFamilies, add categories and items to the form
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
                      <Input {...field} />
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
