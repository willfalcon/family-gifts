import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  categories: string[];
  value: string;
}

export default function CategoryField({categories, value}: Props) {
  
  const form = useFormContext();
  const [inputValue, setInputValue] = useState('')

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Category</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant="outline" role="combobox" className={cn('w-[200px] justify-between', !value && 'text-muted-foreground')}>
              {value ? value : 'Select Category'}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search categories..."
              className="h-9"
              value={inputValue}
              onValueChange={val => {
                setInputValue(val);
              }}
            />
            <CommandList>
              <CommandEmpty>
                <Button onClick={() => {
                  form.setValue('category', inputValue);
                }}>Add {inputValue}</Button>
              </CommandEmpty>
              <CommandGroup>
                {categories.map(category => (
                  <CommandItem
                    value={category}
                    key={category}
                    onSelect={() => {
                      form.setValue('category', category);
                    }}
                  >
                    {category}
                    <CheckIcon className={cn('ml-auto h-4 w-4', category === value ? 'opacity-100' : 'opacity-50')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}