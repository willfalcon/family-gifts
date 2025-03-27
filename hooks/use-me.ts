import { GetUser, getUser } from '@/lib/queries/user';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useMe = (): UseQueryResult<GetUser> => {
  const { data: session } = useSession();
  const queryRes = useQuery({
    queryKey: ['user', session?.user?.id],
    queryFn: async () => {
      const user = await getUser(session?.user?.id ?? '');
      console.log(user);
      return user;
    },
    enabled: !!session?.user?.id,
  });

  return queryRes;
};
