import { Loader2 } from 'lucide-react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { FamilySchemaType } from './familySchema';

import RichTextField from '@/components/RichTextField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
    <Card>
      <CardHeader>
        <CardTitle>Family Details</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn(pending && 'opacity-60 pointer-events-none')}>
          <CardContent className="space-y-4">
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
                    <FormDescription>This is the name that will be displayed to members.</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <RichTextField
              name="description"
              description="Provide a short description to help members understand the purpose of this family group."
            />
            {/* 
        {membersQuery.data && membersQuery.data.map((member) => <div key={member.id}>{member.name}</div>)}

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
        <br /> */}
          </CardContent>
          <CardFooter>
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
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
