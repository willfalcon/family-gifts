'use client';

import { Button } from '@/components/ui/button';
import { Item } from '@prisma/client';
import { toast } from 'sonner';
import { markItemAsBought } from './actions';

export default function MarkAsBought(item: Item) {
  async function markBought() {
    try {
      const { success, message, item: updatedItem } = await markItemAsBought(item.id);
      if (!success) {
        toast.error(message);
      }
      if (updatedItem) {
        toast.success(`Marked ${updatedItem.name} as bought.`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    }
  }
  return (
    <Button variant="secondary" onClick={markBought}>
      Mark as Bought
    </Button>
  );
}
