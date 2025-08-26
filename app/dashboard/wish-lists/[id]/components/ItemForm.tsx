import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { ItemSchemaType } from '../itemSchema';

import CurrencyField from '@/components/CurrencyField';
import ImageField from '@/components/ImageField';
import { RadioTabs, RadioTabsItem } from '@/components/RadioTabs';
import RichTextField from '@/components/RichTextField';
import SubmitButton from '@/components/SubmitButton';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
                  <Input {...field} tabIndex={1} />
                </FormControl>
                <FormDescription>Name of the thing you want.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <RadioTabs onValueChange={field.onChange} value={field.value || undefined}>
                  <RadioTabsItem
                    value="low"
                    className="data-[state=checked]:text-green-700 data-[state=checked]:border-green-200 hover:text-green-700 flex-1 data-[state=checked]:bg-green-50 dark:data-[state=checked]:bg-green-950/30"
                  >
                    Low
                  </RadioTabsItem>
                  <RadioTabsItem
                    value="medium"
                    className="data-[state=checked]:text-amber-700 data-[state=checked]:border-amber-200 hover:text-amber-700 flex-1 data-[state=checked]:bg-amber-50 dark:data-[state=checked]:bg-amber-950/30"
                  >
                    Medium
                  </RadioTabsItem>
                  <RadioTabsItem
                    value="high"
                    className="data-[state=checked]:text-rose-700 data-[state=checked]:border-rose-200 hover:text-rose-700 flex-1 data-[state=checked]:bg-rose-50 dark:data-[state=checked]:bg-rose-950/30"
                  >
                    High
                  </RadioTabsItem>
                </RadioTabs>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {/* <FormField
          control={form.control}
          name="categories"
          render={({ field }) => {
            return <CategoryField categories={categories} value={field.value} />;
          }}
        /> */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} tabIndex={1} />
                </FormControl>
                <FormDescription>Link to the item.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <ImageField
          name="image"
          label="Image"
          description="Image of the item. Amazon images are automatically detected."
          previewField="imageUrl"
          tabIndex={1}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <CurrencyField field={field} tabIndex={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <RichTextField name="notes" />
        <SubmitButton>{text}</SubmitButton>
      </form>
    </Form>
  );
}
