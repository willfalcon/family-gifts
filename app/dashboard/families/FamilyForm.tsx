import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { FamilySchemaType } from './familySchema';
import { cn } from '@/lib/utils';
import { Loader2, Plus } from 'lucide-react';
import RichTextField from '@/components/RichTextField';

type FamilyFormProps = {
  form: UseFormReturn<FamilySchemaType>;
  onSubmit: (data: FamilySchemaType) => void;
  submitText: string;
  membersArray: UseFieldArrayReturn<FamilySchemaType, 'members', 'id'>;
  newFam?: boolean;
  pending: boolean;
};

export default function FamilyForm({ form, onSubmit, submitText, membersArray, newFam = false, pending }: FamilyFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', pending && 'opacity-60 pointer-events-none')}>
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
        {membersArray.fields.map((field, index) => (
          <FormField
            control={form.control}
            key={field.id}
            name={`members.${index}.value`}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>{newFam && 'Invite '}Members</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email Address" />
                  </FormControl>
                </FormItem>
              );
            }}
          />
        ))}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="mt-1 rounded-full w-7 h-7 col-start-2"
          onClick={() => membersArray.append({ value: '' })}
          aria-label="Add Member"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <br />
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Form>
  );
}
