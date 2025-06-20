'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Info } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { ItemFromGetList } from '@/lib/queries/items';
import { getPurchasedBy, markAsPurchased } from '../actions';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useViewMode from './useViewMode';

type Props = {
  item: ItemFromGetList;
};

export default function Purchased({ item }: Props) {
  const session = useSession();

  const [viewMode] = useViewMode();

  const {
    data: purchasedBy,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['purchasedBy', item.id],
    queryFn: () => getPurchasedBy(item.id),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ action, itemId }: { action: 'mark' | 'unmark'; itemId: string }) => markAsPurchased(action, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchasedBy', item.id] });
    },
  });

  const currentUserPurchased = purchasedBy?.some((purchaser) => purchaser.id === session?.data?.user?.id);
  const otherPurchasers = purchasedBy?.filter((purchaser) => purchaser.id !== session?.data?.user?.id);

  if (isError) {
    return <div>Error loading purchased</div>;
  }

  if (mutation.isPending || isFetching) {
    return <Skeleton className="h-6 w-[150px]" />;
  }

  return viewMode === 'compact' ? (
    <Checkbox
      checked={currentUserPurchased}
      onCheckedChange={(checked) => {
        if (checked) {
          mutation.mutate({ action: 'mark', itemId: item.id });
        } else {
          mutation.mutate({ action: 'unmark', itemId: item.id });
        }
      }}
      className="flex-shrink-0"
    />
  ) : (
    <div className="flex flex-col gap-2 w-full md:w-auto md:items-end">
      {/* Purchase status indicator */}
      {!!purchasedBy?.length && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <div className="flex -space-x-2">
            {purchasedBy.slice(0, 3).map((purchaser, index) => (
              <Avatar key={purchaser.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={purchaser.image || undefined} alt={purchaser.name || ''} />
                <AvatarFallback>{purchaser.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {purchasedBy.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{purchasedBy.length - 3}
              </div>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                <Info className="h-4 w-4" />
                <span className="sr-only">View purchasers</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-2">
                <h4 className="font-medium">Purchased by:</h4>
                <div className="space-y-1">
                  {purchasedBy.map((purchaser) => (
                    <div key={purchaser.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={purchaser.image || undefined} alt={purchaser.name || undefined} />
                          <AvatarFallback>{purchaser.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{purchaser.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {purchasedBy.length > 1 && (
                  <div className="pt-2 border-t text-sm text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>Multiple people have purchased this item</span>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Purchase checkbox */}
      {mutation.isPending ? (
        <Skeleton className="h-6 w-24" />
      ) : (
        <div className="flex items-center gap-2">
          <Checkbox
            id={`purchased-${item.id}`}
            checked={purchasedBy?.some((purchaser) => purchaser.id === session?.data?.user?.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                mutation.mutate({ action: 'mark', itemId: item.id });
              } else {
                mutation.mutate({ action: 'unmark', itemId: item.id });
              }
            }}
          />
          <label
            htmlFor={`purchased-${item.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {currentUserPurchased ? 'Marked as purchased by you' : purchasedBy?.length ? 'I also purchased this' : 'Mark as purchased'}
          </label>
        </div>
      )}

      {/* Warning if others have purchased */}
      {!currentUserPurchased && otherPurchasers && otherPurchasers.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>
                  Already purchased by {otherPurchasers.length} {otherPurchasers.length === 1 ? 'person' : 'people'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Someone else has already purchased this item. You may want to coordinate with them.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
