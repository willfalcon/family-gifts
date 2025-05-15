import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@radix-ui/react-checkbox';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { searchMembers } from '../actions';
import useAttendeesStore from './store';

export default function MemberSearch() {
  const { searchQuery, setSearchQuery, selectedParticipants, toggleParticipant } = useAttendeesStore();
  const { data: results, isLoading } = useQuery({
    queryKey: ['members', searchQuery],
    queryFn: async () => {
      return await searchMembers(searchQuery);
    },
  });
  const shownResults = results?.filter((member) => !selectedParticipants.includes(member.id));
  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search people..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>
      {searchQuery && (
        <>
          {isLoading && <p>Loading...</p>}
          {shownResults && (
            <div>
              {shownResults.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedParticipants.includes(member.id)}
                    onCheckedChange={() => {
                      toggleParticipant(member.id);
                    }}
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarImage src={member.image || undefined} alt={member.name || ''} />
                      <AvatarFallback>
                        {member.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor={`member-${member.id}`}>{member.name}</Label>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
