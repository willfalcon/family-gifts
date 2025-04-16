'use client';

import { FamilyVisibility } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { GetFamily } from '@/lib/queries/families';
import { updateFamilyPrivacy } from '../../actions';
import { useFamily } from '../../../useFamily';

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function FamilyPrivacy({ family: initialFamily }: { family: GetFamily }) {
  const { data: family, isFetching } = useFamily(initialFamily);

  const [visibility, setVisibility] = useState(family.visibility);
  const [allowInvites, setAllowInvites] = useState(family.allowInvites);
  const [requireApproval, setRequireApproval] = useState(family.requireApproval);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => updateFamilyPrivacy(family.id, { visibility, allowInvites, requireApproval }),
    onSuccess: (data) => {
      queryClient.setQueryData(['family', initialFamily.id], data);
      toast.success('Family privacy updated');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update family privacy');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy & Access Settings</CardTitle>
        <CardDescription>Control who can see and join your family</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Visibility</h3>
          <div>
            <Select onValueChange={(value) => setVisibility(value as FamilyVisibility)} defaultValue={visibility}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private - Only visible to members</SelectItem>
                <SelectItem value="link">By Link - Also allow access via direct link</SelectItem>
                <SelectItem value="public">Public - Anyone can find this family</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-sm text-muted-foreground">This controls who can see your family in search results and directories.</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Member Permissions</h3>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="allow-invites" className="text-base">
                Allow Member Invitations
              </Label>
              <p className="text-sm text-muted-foreground">Let regular members invite new people to the family</p>
            </div>
            <Switch id="allow-invites" checked={allowInvites} onCheckedChange={(checked) => setAllowInvites(checked)} />
          </div>

          {allowInvites && (
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="require-approval" className="text-base">
                  Require Admin Approval
                </Label>
                <p className="text-sm text-muted-foreground">New members must be approved by an admin before joining</p>
              </div>
              <Switch id="require-approval" checked={requireApproval} onCheckedChange={(checked) => setRequireApproval(checked)} />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || isFetching}>
          {(mutation.isPending || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
