'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { joinFamily } from './actions';

export default function JoinButton({ familyId, familyName, userId }: { familyId: string; familyName: string; userId: string }) {
  const router = useRouter();

  const { mutate: join, isPending } = useMutation({
    mutationFn: async () => {
      const res = await joinFamily(familyId);
      return res;
    },
    onSuccess: (data) => {
      const user = data.members.find((member) => member.id === userId);
      toast.success(`Welcome, ${user?.name}`);
      router.push(`/dashboard/`);
    },
    onError: (error) => {
      console.log(error);
      toast.error('Error.');
    },
  });

  return (
    <Button
      onClick={() => {
        join();
      }}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Joining...
        </>
      ) : (
        'Join ' + familyName
      )}
    </Button>
  );
}
