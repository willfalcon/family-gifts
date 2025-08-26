'use client';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { getFavorite, toggleFavorite } from '../actions';

type Props = {
  id: string;
  type: 'family' | 'event' | 'list';
};

export default function Favorite({ id, type }: Props) {
  const queryClient = useQueryClient();
  const { data: favorite } = useQuery({
    queryKey: ['favorite', id],
    queryFn: () => getFavorite(id, type),
  });

  const { mutate: toggle, isPending } = useMutation({
    mutationFn: () => toggleFavorite(id, type),
    onSuccess: () => {
      queryClient.setQueryData(['favorite', id], (old: any) => !old);
    },
  });

  return (
    <Button
      variant="ghost"
      onClick={() => {
        toggle();
      }}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : favorite ? (
        <FaHeart className="w-4 h-4 text-red-500" />
      ) : (
        <FaRegHeart className="w-4 h-4" />
      )}
    </Button>
  );
}
