import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Editor from '@/components/ui/rich-text/editor';

import { Controller, useFormContext } from 'react-hook-form';

export default function InfoField() {
  const form = useFormContext();
  return (
    // prettier-ignore
    <Controller 
      name="info" 
      control={form.control} 
      render={({ field }) => (
        <FormItem>
          <FormLabel>Info</FormLabel>
          <Editor content={field.value} onChange={field.onChange} immediatelyRender={false} />
          <FormMessage />
        </FormItem>
      )} 
    />
  );
}
