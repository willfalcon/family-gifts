'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateProfile } from '../actions';
import { ProfileSchema, ProfileSchemaType } from '../profileSchema';

import { EnhancedDatePicker } from '@/components/EnhancedDatePicker';
import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';
import ImageField from '@/components/ImageField';
import RichTextField from '@/components/RichTextField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface ProfileFormProps {
  user: User;
}

export default function ProfileSettings({ user }: ProfileFormProps) {
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      birthday: user.birthday || undefined,
      bio: JSON.parse(JSON.stringify(user.bio || {})),
      imageUrl: user.image || '',
    },
  });
  async function onSubmit(values: ProfileSchemaType) {
    const { image, ...rest } = values;
    let imageUrl = null;
    if (image) {
      imageUrl = await fetch(`/api/uploadImage?name=${image.name}`, {
        method: 'POST',
        body: image,
      })
        .then((res) => res.text())
        .catch((err) => {
          console.error(err);
          return null;
        });
    }
    try {
      const profile = await updateProfile({ ...rest, ...(imageUrl ? { imageUrl } : {}) });
      toast.success('Profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }

  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Settings', href: '/dashboard/settings' },
    { name: 'Profile', href: '/dashboard/settings?tab=profile' },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birthday</FormLabel>
                    <EnhancedDatePicker date={field.value} setDate={field.onChange} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <ImageField name="image" previewField="imageUrl" label="Profile Image" className="min-h-52" />
            <RichTextField name="bio" />
          </CardContent>
          <CardFooter>
            <Button type="submit">Save</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
