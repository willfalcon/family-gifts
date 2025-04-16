import { Plus } from 'lucide-react';

import { type GetListForEdit } from '@/lib/queries/items';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewItem from '../components/NewItem';
import ItemRow from './ItemRow';

type Props = {
  list: GetListForEdit;
};

export default function ListItemsForm({ list }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Items</CardTitle>
          <CardDescription>Update items in your list.</CardDescription>
        </div>
        <div>
          <NewItem categories={list.categories} />
        </div>
      </CardHeader>
      <CardContent>
        {list.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-muted-foreground">No items in your wish list yet</span>
            <Button variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 pb-2 font-medium text-sm border-b">
              <div className="col-span-4 sm:col-span-5">Item</div>
              <div className="col-span-2 sm:col-span-2 text-right">Price</div>
              <div className="col-span-3 sm:col-span-2">Priority</div>
              <div className="col-span-3 sm:col-span-3 text-right">Actions</div>
            </div>
            {list.items.map((item, index) => (
              <ItemRow key={item.id} index={index} item={item} categories={list.categories} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
