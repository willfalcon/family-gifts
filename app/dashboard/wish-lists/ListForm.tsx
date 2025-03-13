import { Controller, UseFormReturn } from 'react-hook-form';
import { ListSchemaType } from './listSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Family } from '@prisma/client';
import Editor from '@/components/ui/rich-text/editor';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
type ListFormProps = {
  form: UseFormReturn<ListSchemaType>;
  onSubmit: (data: ListSchemaType) => Promise<void>;
  submitText: string;
};

export default function ListForm({ form, onSubmit, submitText }: ListFormProps) {
  const { data, isLoading } = useQuery({ queryKey: ['families'], queryFn: () => fetch('/api/getFamilies').then((res) => res.json()) });
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
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Info</FormLabel>
              <Editor content={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibleTo"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="block">Families</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn('justify-between', !field.value && 'text-muted-foreground')}
                        // tabIndex={0}
                      >
                        {field.value.length > 0
                          ? `Shared with ${field.value.length} ${field.value.length > 1 ? 'families' : 'family'}`
                          : 'Select families'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search families..." />
                      <CommandList>
                        <CommandEmpty>No families found.</CommandEmpty>
                        {/* {families?.length && ( */}
                        <CommandGroup>
                          {isLoading && <Loader2 className="w-full my-5 animate-spin" />}
                          {data?.families?.map((family: Family) => (
                            <CommandItem
                              key={family.id}
                              onSelect={() => {
                                const current = field.value;
                                const value = family.id;
                                form.setValue('visibleTo', current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', field.value.includes(family.id) ? 'opacity-100' : 'opacity-0')} />
                              {family.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        {/* )} */}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>These families will be able to view this list and mark things as bought.</FormDescription>
              </FormItem>
            );
          }}
        />
        <SubmitButton>{submitText}</SubmitButton>
      </form>
    </Form>
  );
}
