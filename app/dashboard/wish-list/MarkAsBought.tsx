import { markItemAsBought, unmarkItemAsBought } from '@/app/dashboard/family/actions';
import { Button } from '@/components/ui/button';
import { Item } from '@prisma/client';
import { toast } from 'sonner';
import { ItemWithRefs } from '@/prisma/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { useMe } from '@/app/dashboard/Providers';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getItemBoughtBy, toggleBoughtBy } from './actions';

type Props = {
  item: ItemWithRefs;
};

export default function MarkAsBought({ item: initialItem }: Props) {
  const { data: me } = useMe();

  const { data: item } = useQuery({
    queryKey: ['boughtBy', initialItem.id, me?.id],
    queryFn: async (): Promise<ItemWithRefs | null> => {
      const { success, message, item } = await getItemBoughtBy(initialItem.id);
      if (!success || !item) {
        throw new Error(message);
      }
      return item;
    },
    initialData: initialItem,
  });

  const boughtByMe = item?.boughtBy.some((b) => b.id === me?.id);
  const queryClient = useQueryClient();

  const boughtMutation = useMutation({
    mutationFn: async ({ itemId, bought }: { itemId: string; bought: boolean }) => {
      const { success, message, item: updatedItem } = await toggleBoughtBy(itemId, bought);
      if (!success) {
        throw new Error(message);
      }
      return updatedItem;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['boughtBy', initialItem.id, me?.id] }),
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  return item?.boughtBy.length ? (
    <div className="flex items-center">
      {boughtByMe ? (
        <Button
          variant="outline"
          className={'rounded-r-none'}
          onClick={async () => {
            boughtMutation.mutate({ itemId: initialItem.id, bought: false });
          }}
          disabled={boughtMutation.isPending}
        >
          {boughtMutation.isPending && <Loader2 className="animate-spin" />}
          Unmark as bought
        </Button>
      ) : (
        <Button variant="outline" className={'rounded-r-none'} disabled={boughtMutation.isPending}>
          {boughtMutation.isPending && <Loader2 className="animate-spin" />}
          Bought By {item.boughtBy[0].name}
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={'rounded-l-none border-l-0 px-2'}>
            <CaretDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Bought by {item.boughtBy.map((m) => m.name).join(', ')}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={async () => {
              boughtMutation.mutate({ itemId: initialItem.id, bought: true });
            }}
            disabled={boughtMutation.isPending}
          >
            {boughtMutation.isPending && <Loader2 className="animate-spin" />}I also bought this
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Message other buyers</DropdownMenuItem> */}
          {/* <DropdownMenuItem>Create thingy</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <Button
      variant="outline"
      onClick={async () => {
        boughtMutation.mutate({ itemId: initialItem.id, bought: true });
      }}
      disabled={boughtMutation.isPending}
    >
      {boughtMutation.isPending && <Loader2 className="animate-spin" />}
      Mark as bought
    </Button>
  );
}
