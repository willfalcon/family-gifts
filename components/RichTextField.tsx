import { Controller, useFormContext } from 'react-hook-form';

import { FormDescription, FormItem, FormLabel, FormMessage } from './ui/form';
import Editor from './ui/rich-text/editor';

type Props = {
  name: string;
  description?: string;
  className?: string;
};

export default function RichTextField({ name, description, className }: Props) {
  const form = useFormContext();
  if (!form) {
    throw new Error('RichTextField must be used within a Form');
  }

  // console.log(document.activeElement);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>Info</FormLabel>
          <Editor content={field.value} onChange={field.onChange} immediatelyRender={false} />
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
