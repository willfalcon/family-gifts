'use client';

import { ListVisibility, Visibility } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CalendarDays, Eye, EyeOff, Share2, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { getUser, GetUser } from '@/lib/queries/user';
import { updatePrivacySettings } from '../actions';

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import DefaultListVisibility from './DefaultListVisibility';

type Props = {
  user: GetUser;
};

enum MainVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CUSTOM = 'custom',
}

export default function PrivacySettings({ user }: Props) {
  const query = useQuery({
    queryFn: () => getUser(user.id),
    queryKey: ['user', user.id],
    initialData: user,
  });

  const [profileVisibilities, setProfileVisibility] = useState<Visibility[]>(query.data?.profileVisibility || []);
  const [profileMainVisibility, setProfileMainVisibility] = useState<MainVisibility>(
    profileVisibilities.includes(Visibility.public)
      ? MainVisibility.PUBLIC
      : profileVisibilities.includes(Visibility.private)
        ? MainVisibility.PRIVATE
        : MainVisibility.CUSTOM,
  );
  const [defaultListVisibility, setDefaultListVisibility] = useState<ListVisibility>(query.data?.defaultListVisibility || ListVisibility.private);

  const mutation = useMutation({
    mutationFn: async () => {
      const profileVisibility =
        profileMainVisibility === MainVisibility.PUBLIC
          ? [Visibility.public]
          : profileMainVisibility === MainVisibility.PRIVATE
            ? [Visibility.private]
            : profileVisibilities;
      await updatePrivacySettings({
        profileVisibility: profileVisibility,
        defaultListVisibility: defaultListVisibility,
      });
    },
    onSuccess: () => {
      toast.success('Privacy settings updated');
    },
    onError: () => {
      toast.error('Failed to update privacy settings');
    },
  });

  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Settings', href: '/dashboard/settings' },
    { name: 'Privacy', href: '/dashboard/settings?tab=privacy' },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control who can see your profile and activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Profile Visibility</h3>
            <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
          </div>
        </div>
        <RadioGroup value={profileMainVisibility} onValueChange={(value) => setProfileMainVisibility(value as MainVisibility)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MainVisibility.PUBLIC} id="profile-public" />
            <Label htmlFor="profile-public" className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              <span>Public (Anyone can see your profile)</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MainVisibility.CUSTOM} id="profile-custom" />
            <Label htmlFor="profile-custom" className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Some people (People in groups you choose can see your profile)</span>
            </Label>
          </div>
          {profileMainVisibility === MainVisibility.CUSTOM && (
            <div className="space-y-2 ml-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profile-custom-families"
                  checked={profileVisibilities.includes(Visibility.family)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setProfileVisibility([...profileVisibilities, Visibility.family]);
                    } else {
                      setProfileVisibility(profileVisibilities.filter((v) => v !== Visibility.family));
                    }
                  }}
                />
                <Label htmlFor="profile-custom-families" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  Family Members
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profile-custom-events"
                  checked={profileVisibilities.includes(Visibility.events)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setProfileVisibility([...profileVisibilities, Visibility.events]);
                    } else {
                      setProfileVisibility(profileVisibilities.filter((v) => v !== Visibility.events));
                    }
                  }}
                />
                <Label htmlFor="profile-custom-events" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-purple-500" />
                  Other Events Attendees
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profile-custom-lists"
                  checked={profileVisibilities.includes(Visibility.lists)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setProfileVisibility([...profileVisibilities, Visibility.lists]);
                    } else {
                      setProfileVisibility(profileVisibilities.filter((v) => v !== Visibility.lists));
                    }
                  }}
                />
                <Label htmlFor="profile-custom-lists" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-yellow-500" />
                  People you've shared lists with
                </Label>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MainVisibility.PRIVATE} id="profile-private" />
            <Label htmlFor="profile-private" className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-red-500" />
              <span>Nobody (Your profile will be hidden)</span>
            </Label>
          </div>
        </RadioGroup>

        {/* Default Wishlist Visibility */}
        <DefaultListVisibility defaultListVisibility={defaultListVisibility} setDefaultListVisibility={setDefaultListVisibility} />
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            mutation.mutate();
          }}
          disabled={mutation.isPending || query.isFetching}
        >
          Save Privacy Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
