import { GetFamilies } from '@/lib/queries/families';
import useAttendeesStore from './store';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
  families: GetFamilies[];
};

export default function PrimaryFamily({ families }: Props) {
  const { family, setFamily } = useAttendeesStore();
  return (
    <div className="grid gap-2">
      <Label htmlFor="family">Primary Family (Optional)</Label>
      <Select value={family} onValueChange={setFamily}>
        <SelectTrigger id="family">
          <SelectValue placeholder="Select a family (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No primary family</SelectItem>
          {families?.map((family) => (
            <SelectItem key={family.id} value={family.id}>
              {family.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">The family primarily associated with this event. Leave empty for individual gatherings.</p>
    </div>
  );
}
