import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { ItemSchemaType } from './wishListSchema';
import { Textarea } from '@/components/ui/textarea';
import CategoryField from './CategoryField';

type WishListFormProps = {
  form: UseFormReturn<ItemSchemaType>;
  onSubmit: (data: ItemSchemaType) => Promise<void>;
  text: string;
  categories: string[];
};

export default function WishListForm({ form, onSubmit, text, categories }: WishListFormProps) {
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
                <FormDescription>Name of the thing you want.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormDescription>Link to the item.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>Link to the item.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => {
            return <CategoryField categories={categories} value={field.value} />;
          }}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {text}
        </Button>
      </form>
    </Form>
  );
}
