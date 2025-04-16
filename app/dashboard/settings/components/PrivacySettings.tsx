'use client';

import { Visibility } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CalendarDays, Eye, EyeOff, Share2, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { getUser, GetUser } from '@/lib/queries/user';
import { updatePrivacySettings } from '../actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

  console.log(user, query.data);
  const [profileVisibilities, setProfileVisibility] = useState<Visibility[]>(query.data?.profileVisibility || []);
  const [profileMainVisibility, setProfileMainVisibility] = useState<MainVisibility>(
    profileVisibilities.includes(Visibility.public)
      ? MainVisibility.PUBLIC
      : profileVisibilities.includes(Visibility.private)
        ? MainVisibility.PRIVATE
        : MainVisibility.CUSTOM,
  );
  const [wishlistVisibilities, setWishlistVisibility] = useState<Visibility[]>(query.data?.wishListVisibility || []);
  const [wishlistMainVisibility, setWishlistMainVisibility] = useState<MainVisibility>(
    wishlistVisibilities.includes(Visibility.public)
      ? MainVisibility.PUBLIC
      : wishlistVisibilities.includes(Visibility.private)
        ? MainVisibility.PRIVATE
        : MainVisibility.CUSTOM,
  );

  const mutation = useMutation({
    mutationFn: async () => {
      const profileVisibility =
        profileMainVisibility === MainVisibility.PUBLIC
          ? [Visibility.public]
          : profileMainVisibility === MainVisibility.PRIVATE
            ? [Visibility.private]
            : profileVisibilities;
      const wishListVisibility =
        wishlistMainVisibility === MainVisibility.PUBLIC
          ? [Visibility.public]
          : wishlistMainVisibility === MainVisibility.PRIVATE
            ? [Visibility.private]
            : wishlistVisibilities;
      await updatePrivacySettings({
        profileVisibility: profileVisibility,
        wishListVisibility: wishListVisibility,
      });
    },
    onSuccess: () => {
      toast.success('Privacy settings updated');
    },
    onError: () => {
      toast.error('Failed to update privacy settings');
    },
  });
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
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Default Wishlist Visibility</h3>
            <p className="text-sm text-muted-foreground">Control who can see your wishlists by default</p>
          </div>
        </div>
        <RadioGroup value={wishlistMainVisibility} onValueChange={(value) => setWishlistMainVisibility(value as MainVisibility)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MainVisibility.PUBLIC} id="list-public" />
            <Label htmlFor="list-public" className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              <span>Public (Anyone can see your wish lists)</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MainVisibility.CUSTOM} id="list-custom" />
            <Label htmlFor="list-custom" className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Some people (People in groups you choose can see your wish lists)</span>
            </Label>
          </div>
          {wishlistMainVisibility === MainVisibility.CUSTOM && (
            <div className="space-y-2 ml-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="list-custom-families"
                  checked={wishlistVisibilities.includes(Visibility.family)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setWishlistVisibility([...wishlistVisibilities, Visibility.family]);
                    } else {
                      setWishlistVisibility(wishlistVisibilities.filter((v) => v !== Visibility.family));
                    }
                  }}
                />
                <Label htmlFor="list-custom-families" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  Family Members
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="list-custom-events"
                  checked={wishlistVisibilities.includes(Visibility.events)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setWishlistVisibility([...wishlistVisibilities, Visibility.events]);
                    } else {
                      setWishlistVisibility(wishlistVisibilities.filter((v) => v !== Visibility.events));
                    }
                  }}
                />
                <Label htmlFor="list-custom-events" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-purple-500" />
                  Other Events Attendees
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="list-custom-lists"
                  checked={wishlistVisibilities.includes(Visibility.lists)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setWishlistVisibility([...wishlistVisibilities, Visibility.lists]);
                    } else {
                      setWishlistVisibility(wishlistVisibilities.filter((v) => v !== Visibility.lists));
                    }
                  }}
                />
                <Label htmlFor="list-custom-lists" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-yellow-500" />
                  People you've shared lists with
                </Label>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MainVisibility.PRIVATE} id="list-private" />
            <Label htmlFor="list-private" className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-red-500" />
              <span>Nobody (Your wish lists will be hidden)</span>
            </Label>
          </div>
        </RadioGroup>
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
