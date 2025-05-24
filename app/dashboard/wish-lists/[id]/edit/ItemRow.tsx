'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { capitalize, cn, formatCurrency } from '@/lib/utils';
import { Item } from '@prisma/client';
import { ItemSchema, ItemSchemaType } from '../itemSchema';
import { getItemToEdit, updateItem } from './actions';

import CurrencyField from '@/components/CurrencyField';
import ImageField from '@/components/ImageField';
import { RadioTabs, RadioTabsItem } from '@/components/RadioTabs';
import RichTextField from '@/components/RichTextField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CategoryField from '../components/CategoryField';
import DeleteItem from '../components/DeleteItem';

type Props = {
  index: number;
  item: Item;
  categories: string[];
};

export default function ItemRow({ item, categories }: Props) {
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
      imageUrl: undefined,
    },
  });

  const query = useQuery({
    queryKey: ['item', item.id],
    queryFn: () => getItemToEdit(item.id),
    initialData: item,
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
        imageUrl: query.data.image || undefined,
      });
    }
  }, [query.data, form]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: ItemSchemaType) => {
      const { image, ...rest } = values;
      let imageUrl = null;
      if (image) {
        imageUrl = await fetch(`/api/uploadImage?name=${image.name}`, {
          method: 'POST',
          body: image,
        })
          .then((res) => res.text())
          .catch((err) => {
            console.error(err);
            return null;
          });
      }
      return updateItem(item.id, {
        ...rest,
        notes: JSON.parse(JSON.stringify(values.notes || {})),
        ...(imageUrl ? { imageUrl } : {}),
      });
    },
    onSuccess: (item) => {
      queryClient.setQueryData(['item', item.id], item);
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
            {item.price && <div className="col-span-2 sm:col-span-2 text-right">{formatCurrency(item.price) || '-'}</div>}
            <div className="col-span-3 sm:col-span-2 justify-self-start">
              {item.priority && (
                <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                  {capitalize(item.priority)}
                </Badge>
              )}
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

            {query.data && <DeleteItem item={query.data} />}
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
              <div className="md:grid gap-4 md:grid-cols-3 my-4">
                <div className="col-span-1">
                  <ImageField name="image" label="Image" previewField="imageUrl" />
                </div>
                <div className="md:col-span-2">
                  <RichTextField name="notes" />
                </div>
              </div>
              {/* <Controller
                name="notes"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid gap-2 mt-4">
                    <FormLabel>Notes</FormLabel>
                    <Editor content={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
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
                        <RadioTabs onValueChange={field.onChange} value={field.value || undefined}>
                          <RadioTabsItem
                            value="low"
                            className="data-[state=checked]:text-green-700 data-[state=checked]:border-green-200 hover:text-green-700 flex-1 data-[state=checked]:bg-green-50 dark:data-[state=checked]:bg-green-950/30"
                          >
                            Low
                          </RadioTabsItem>
                          <RadioTabsItem
                            value="medium"
                            className="data-[state=checked]:text-amber-700 data-[state=checked]:border-amber-200 hover:text-amber-700 flex-1 data-[state=checked]:bg-amber-50 dark:data-[state=checked]:bg-amber-950/30"
                          >
                            Medium
                          </RadioTabsItem>
                          <RadioTabsItem
                            value="high"
                            className="data-[state=checked]:text-rose-700 data-[state=checked]:border-rose-200 hover:text-rose-700 flex-1 data-[state=checked]:bg-rose-50 dark:data-[state=checked]:bg-rose-950/30"
                          >
                            High
                          </RadioTabsItem>
                        </RadioTabs>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
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
