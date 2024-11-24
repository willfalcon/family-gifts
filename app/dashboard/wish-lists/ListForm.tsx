import { UseFormReturn } from 'react-hook-form';
import { ListSchemaType } from './listSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Family } from '@prisma/client';

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
        <Button type="submit">{submitText}</Button>
      </form>
    </Form>
  );
}
