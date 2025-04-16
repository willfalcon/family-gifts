import { Controller, useFormContext } from 'react-hook-form';

import { FormDescription, FormItem, FormLabel, FormMessage } from './ui/form';
import Editor from './ui/rich-text/editor';

export default function RichTextField({ name, description }: { name: string; description?: string }) {
  const form = useFormContext();
  if (!form) {
    throw new Error('RichTextField must be used within a Form');
  }

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Info</FormLabel>
          <Editor content={field.value} onChange={field.onChange} immediatelyRender={false} />
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
