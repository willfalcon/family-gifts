import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

import { getAllEvents, getFamilies } from './actions';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { RelationshipType } from './MembersList';

type Props = {
  relationshipFilter: RelationshipType;
  setRelationshipFilter: Dispatch<SetStateAction<RelationshipType>>;
  furtherFilter: string | undefined;
  setFurtherFilter: Dispatch<SetStateAction<string | undefined>>;
};

export default function RelationFilter({ relationshipFilter, setRelationshipFilter, furtherFilter, setFurtherFilter }: Props) {
  // get families, events, and lists based on current selection and add another select to further filter
  const query = useQuery({
    queryKey: ['relationFilters', relationshipFilter],
    queryFn: async () => {
      switch (relationshipFilter) {
        case 'family':
          return await getFamilies();
        case 'event':
          return await getAllEvents();
        default:
          return undefined;
      }
    },
  });

  return (
    <div className="w-full md:w-auto flex gap-4">
      <Select value={relationshipFilter} onValueChange={(value) => setRelationshipFilter(value as RelationshipType)}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filter by relationship" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Relationship Type</SelectLabel>
            <SelectItem value="all">All Connections</SelectItem>
            <SelectItem value="family">Family Members</SelectItem>
            <SelectItem value="event">Event Attendees</SelectItem>
            <SelectItem value="shared_list">Shared Lists</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {(relationshipFilter === 'event' || relationshipFilter === 'family') &&
        (query.isFetching ? (
          <Skeleton className="h-[36px] w-[125px]" />
        ) : (
          <Select value={furtherFilter} onValueChange={(value) => setFurtherFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Filter by ${relationshipFilter}`} />
            </SelectTrigger>
            <SelectContent>
              {query.data?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
    </div>
  );
}
