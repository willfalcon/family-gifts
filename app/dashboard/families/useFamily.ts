import { useQuery } from '@tanstack/react-query';

import { GetFamily } from '@/lib/queries/families';
import { getFamily } from './[id]/actions';

export const useFamily = (initialFamily: GetFamily) =>
  useQuery({
    queryKey: ['family', initialFamily.id],
    queryFn: () => getFamily(initialFamily.id),
    initialData: initialFamily,
  });
