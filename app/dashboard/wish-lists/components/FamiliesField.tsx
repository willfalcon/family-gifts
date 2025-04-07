import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, Loader2, Check } from 'lucide-react';

import { Family } from '@prisma/client';
import { getFamilies } from '../actions';
import { cn } from '@/lib/utils';

import { Command, CommandGroup, CommandEmpty, CommandList, CommandInput, CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormField, FormLabel, FormDescription } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function FamiliesField() {
  const form = useFormContext();
  const { data, isLoading } = useQuery({
    queryKey: ['families'],
    queryFn: () => {
      return getFamilies();
    },
  });
  return (
    <FormField
      control={form.control}
      name="visibleToFamilies"
      render={({ field }) => {
        return (
          <FormItem className="grid gap-2 w-72">
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
                    <CommandGroup>
                      {isLoading && <Loader2 className="w-full my-5 animate-spin" />}
                      {data?.map((family: Family) => (
                        <CommandItem
                          key={family.id}
                          onSelect={() => {
                            const current = field.value;
                            const value = family.id;
                            form.setValue(
                              'visibleToFamilies',
                              current.includes(value) ? current.filter((v: Family['id']) => v !== value) : [...current, value],
                            );
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
            <FormDescription>Members of these families will be able to view this list and mark things as bought.</FormDescription>
          </FormItem>
        );
      }}
    />
  );
}
