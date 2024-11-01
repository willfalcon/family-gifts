import Editor from '@/components/ui/rich-text/editor';

import { Controller, useFormContext } from 'react-hook-form';

export default function InfoField() {
  const form = useFormContext();
  console.log(form.getValues());
  return (
    // prettier-ignore
    <Controller 
      name="info" 
      control={form.control} 
      render={({ field }) => (
        <Editor content={field.value} onChange={field.onChange} />
      )} 
    />
  );
}
