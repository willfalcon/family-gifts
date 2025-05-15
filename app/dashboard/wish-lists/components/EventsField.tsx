import { Event } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getEvents } from '../actions';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function EventsField() {
  const form = useFormContext();
  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => {
      // TODO: maybe offer an option to load past events?
      return getEvents();
    },
  });
  return (
    <FormField
      control={form.control}
      name="visibleToEvents"
      render={({ field }) => {
        return (
          <FormItem className="grid gap-2 w-72">
            <FormLabel className="block">Events</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn('justify-between', !field.value && 'text-muted-foreground')}
                    // tabIndex={0}
                  >
                    {field.value.length > 0 ? `Shared with ${field.value.length} ${field.value.length > 1 ? 'events' : 'event'}` : 'Select events'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search families..." />
                  <CommandList>
                    <CommandEmpty>No events found.</CommandEmpty>
                    <CommandGroup>
                      {isLoading && <Loader2 className="w-full my-5 animate-spin" />}
                      {data?.map((event: Event) => (
                        <CommandItem
                          key={event.id}
                          onSelect={() => {
                            const current = field.value;
                            const value = event.id;
                            form.setValue(
                              'visibleToEvents',
                              current.includes(value) ? current.filter((v: Event['id']) => v !== value) : [...current, value],
                            );
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', field.value.includes(event.id) ? 'opacity-100' : 'opacity-0')} />
                          {event.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {/* )} */}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>Participants of these events will be able to view this list and mark things as bought.</FormDescription>
          </FormItem>
        );
      }}
    />
  );
}
