import { UseFormReturn } from "react-hook-form";
import { FamilyMemberSchemaType } from "./familyMemberSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type MemberFormProps = {
  form: UseFormReturn<FamilyMemberSchemaType>;
  onSubmit: (data: FamilyMemberSchemaType) => Promise<void>;
  submitText: string; 
}

export default function MemberForm({form, onSubmit, submitText}: MemberFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-4">
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <Button type="submit">{submitText}</Button>
      </form>
    </Form>
  );
}