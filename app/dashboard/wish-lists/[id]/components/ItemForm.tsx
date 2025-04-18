import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { ItemSchemaType } from '../itemSchema';

import CurrencyField from '@/components/CurrencyField';
import RichTextField from '@/components/RichTextField';
import SubmitButton from '@/components/SubmitButton';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategoryField from './CategoryField';

type ItemFormProps = {
  form: UseFormReturn<ItemSchemaType>;
  onSubmit: (data: ItemSchemaType) => Promise<void>;
  text: string;
  categories: string[];
  className?: string;
};

export default function ItemForm({ form, onSubmit, text, categories, className = '' }: ItemFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className, 'space-y-4')}>
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
          name="price"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <CurrencyField field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <RichTextField name="notes" />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => {
            return <CategoryField categories={categories} value={field.value} />;
          }}
        />
        <SubmitButton>{text}</SubmitButton>
      </form>
    </Form>
  );
}
