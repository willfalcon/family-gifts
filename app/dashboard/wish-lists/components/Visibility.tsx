import { Globe, LinkIcon, Lock, Users } from 'lucide-react';
import { FormEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import EventsField from './EventsField';
import FamiliesField from './FamiliesField';
import UsersField from './UsersField';

export default function Visibility({ shareLinkId }: { shareLinkId?: string | null }) {
  const form = useFormContext();

  const shareLink = process.env.NEXT_PUBLIC_FRONTEND_URL + '/list/' + shareLinkId;
  const copyShareLink = (e: FormEvent) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        console.log('Link copied to clipboard');
        toast.success('Link copied to clipboard');
      })
      .catch((err) => {
        toast.error('Failed to copy link');
        console.error('Failed to copy link: ', err);
      });
  };

  // TODO: add a way to handle accessibility of list via view links
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibility</CardTitle>
        <CardDescription>Control who can see your list.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="visibilityType"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="private" />
                      </FormControl>
                      <div className="grid gap-1.5 w-full">
                        <FormLabel className="cursor-pointer space-y-2">
                          <div className="font-medium flex items-center">
                            <Lock className="h-4 w-4 mr-2" />
                            Private
                          </div>
                          <FormDescription>Only you can see this wish list</FormDescription>
                        </FormLabel>
                      </div>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="link" />
                      </FormControl>
                      <div className="grid gap-1.5 w-full">
                        <FormLabel className="cursor-pointer space-y-2">
                          <div className="font-medium flex items-center">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Anyone with the link
                          </div>
                          <FormDescription>Anyone with the link can see this wish list</FormDescription>
                        </FormLabel>
                      </div>
                    </FormItem>
                    {field.value === 'link' && (
                      <div className="flex mt-2">
                        <Input value={shareLink} readOnly className="rounded-r-none" />
                        <Button onClick={copyShareLink} className="rounded-l-none" variant="secondary">
                          Copy
                        </Button>
                      </div>
                    )}

                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="public" />
                      </FormControl>
                      <div className="grid gap-1.5 w-full">
                        <FormLabel className="cursor-pointer space-y-2">
                          <div className="font-medium flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            Public
                          </div>
                          <FormDescription>Anyone can find and view this wish list</FormDescription>
                        </FormLabel>
                      </div>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="specific" />
                      </FormControl>
                      <div className="grid gap-1.5 w-full pointer">
                        <FormLabel className="cursor-pointer space-y-2">
                          <div className="font-medium flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Specific people and groups
                          </div>
                          <FormDescription>Only selected families, events, and individuals can view this wish list</FormDescription>
                        </FormLabel>
                      </div>
                    </FormItem>
                    {field.value === 'specific' && (
                      <div className="space-y-4 mt-2 ml-5">
                        <FamiliesField />
                        <EventsField />
                        <UsersField />
                      </div>
                    )}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
