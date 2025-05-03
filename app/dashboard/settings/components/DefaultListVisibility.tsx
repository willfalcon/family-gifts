import { EyeOff, Users } from 'lucide-react';

import { Eye } from 'lucide-react';

import { Label } from '@/components/ui/label';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Visibility } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  defaultListVisibility: Visibility;
  setDefaultListVisibility: Dispatch<SetStateAction<Visibility>>;
};

export default function DefaultListVisibility({ defaultListVisibility, setDefaultListVisibility }: Props) {
  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Default Wishlist Visibility</h3>
          <p className="text-sm text-muted-foreground">Control who can see your wishlists by default</p>
        </div>
      </div>
      <RadioGroup value={defaultListVisibility} onValueChange={(value) => setDefaultListVisibility(value as Visibility)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={Visibility.public} id="list-public" />
          <Label htmlFor="list-public" className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <span>Public (Anyone can see your wish lists)</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={Visibility.some} id="list-custom" />
          <Label htmlFor="list-custom" className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>Some people (People in groups you choose can see your wish lists)</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={Visibility.private} id="list-private" />
          <Label htmlFor="list-private" className="flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-red-500" />
            <span>Nobody (Your wish lists will be hidden)</span>
          </Label>
        </div>
      </RadioGroup>
    </>
  );
}
