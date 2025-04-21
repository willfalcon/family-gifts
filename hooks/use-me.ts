import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { getUser } from '@/app/actions';
import { GetUser } from '@/lib/queries/user';

export const useMe = (): UseQueryResult<GetUser> => {
  const { data: session } = useSession();

  const queryRes = useQuery({
    queryKey: ['user', session?.user?.id],
    queryFn: async () => {
      const user = await getUser(session?.user?.id ?? '');
      return user;
    },
    enabled: !!session?.user?.id,
  });
  return queryRes;
};
