import { GetUser, getUser } from '@/lib/queries/user';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useMe = (): UseQueryResult<GetUser> => {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ['user', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        return null;
      }
      return await getUser(session.user.id);
    },
    enabled: !!session?.user?.id,
  });
};
