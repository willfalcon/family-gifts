'use client';

import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GetList } from '@/lib/queries/items';
import { ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getItemToEdit, updateItem } from './actions';
import { CollapsibleContent } from '@radix-ui/react-collapsible';
import { Controller, useForm } from 'react-hook-form';
import { ItemSchema, ItemSchemaType } from '../itemSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CurrencyField from '@/components/CurrencyField';
import { zodResolver } from '@hookform/resolvers/zod';
import Editor from '@/components/ui/rich-text/editor';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategoryField from '../components/CategoryField';
import SubmitButton from '@/components/SubmitButton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Props = {
  index: number;
  item: GetList['items'][number];
  categories: string[];
};

export default function ItemRow({ item, index, categories }: Props) {
  // console.log(categories);
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      name: '',
      link: undefined,
      price: null,
      priority: 'low',
      categories: [],
      notes: '',
    },
  });

  const query = useQuery({
    queryKey: ['item', item.id],
    queryFn: () => getItemToEdit(item.id),
    enabled: isExpanded,
  });

  useEffect(() => {
    if (query.data) {
      form.reset({
        name: query.data.name,
        link: query.data.link || undefined,
        price: query.data.price,
        priority: query.data.priority,
        categories: query.data.categories,
        notes: query.data.notes,
      });
    }
  }, [query.data, form]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ItemSchemaType) => updateItem(item.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', item.id] });
      toast.success('Item updated');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to update item');
    },
  });

  function onSubmit(data: ItemSchemaType) {
    mutation.mutate(data);
  }

  const pending = mutation.isPending || query.isFetching;

  return (
    <div className="border rounded-md">
      {/* Collapsed view - summary row */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="grid grid-cols-12 gap-4 p-3 items-center">
          <CollapsibleTrigger className="col-span-4 sm:col-span-9 grid grid-cols-9 gap-4 items-center">
            <div className="col-span-5 font-medium truncate justify-self-start">{item.name || 'Unnamed Item'}</div>
            <div className="col-span-2 sm:col-span-2 text-right">{item.price || '-'}</div>
            <div className="col-span-3 sm:col-span-2 justify-self-start">
              <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>{item.priority}</Badge>
            </div>
          </CollapsibleTrigger>
          <div className="col-span-3 flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse item details' : 'Expand item details'}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              // onClick={() => removeItem(item.id)}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        <CollapsibleContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn('p-4 border-t', pending && 'opacity-50')}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem className="grid gap-2">
                        <FormLabel>Item Name</FormLabel>
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
                  name="price"
                  render={({ field }) => {
                    return (
                      <FormItem className="grid gap-2">
                        <FormLabel>Price (Optional)</FormLabel>
                        <FormControl>
                          <CurrencyField field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Controller
                name="notes"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid gap-2 mt-4">
                    <FormLabel>Notes</FormLabel>
                    <Editor content={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-3 my-4">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => {
                    return (
                      <FormItem className="grid gap-2">
                        <FormLabel>Link</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
                    console.log(field.value);
                    return <CategoryField categories={categories} value={field.value} className="block" />;
                  }}
                />
              </div>
              <Button type="submit" disabled={pending}>
                {pending ? 'Updating...' : 'Update'}
              </Button>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
