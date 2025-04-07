import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { twMerge } from 'tailwind-merge';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useMeasure from 'react-use-measure';
type Props = {
  categories: string[];
  value: string[];
  className?: string;
};

function formatList(items: string[]): string {
  if (!items.length) return 'Select Categories';
  if (items.length === 1) return items[0];

  const displayItems = items.slice(0, 3);
  const remaining = items.length - displayItems.length;

  const displayText = displayItems.join(', ');
  return remaining > 0 ? `${displayText} and ${remaining} more` : displayItems.slice(0, -1).join(', ') + ' and ' + displayItems.slice(-1);
}

export default function CategoryField(props: Props) {
  const { categories: initialCategories, value, className } = props;

  const form = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const displayList = formatList(value);
  const [ref, bounds] = useMeasure();

  return (
    <FormItem className={twMerge('flex flex-col', className)}>
      <FormLabel>Categories</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button ref={ref} variant="outline" role="combobox" className={cn('w-full justify-between flex', !value && 'text-muted-foreground')}>
              {displayList}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className={`p-0`} style={{ width: `${bounds.width}px` }}>
          <Command>
            <CommandInput
              placeholder="Search or add categories..."
              className="h-9"
              value={inputValue}
              onValueChange={(val) => {
                setInputValue(val);
              }}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue.length > 0 && (
                  <Button
                    onClick={() => {
                      setCategories([...categories, inputValue]);
                      form.setValue('categories', [...value, inputValue]);
                      setInputValue('');
                      setOpen(false);
                    }}
                  >
                    Add {inputValue}
                  </Button>
                )}
              </CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    value={category}
                    key={category}
                    onSelect={() => {
                      if (value.includes(category)) {
                        form.setValue(
                          'categories',
                          value.filter((c) => c !== category),
                        );
                      } else {
                        form.setValue('categories', [...value, category]);
                      }
                    }}
                  >
                    {category}
                    <CheckIcon className={cn('ml-auto h-4 w-4', value.includes(category) ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
