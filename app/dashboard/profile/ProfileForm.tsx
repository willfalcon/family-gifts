'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ProfileSchema, ProfileSchemaType } from './profileSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { updateProfile } from './actions';
import { User } from '@prisma/client';
import RichTextField from '@/components/RichTextField';

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: user.name || '', email: user.email || '' },
  });
  async function onSubmit(values: ProfileSchemaType) {
    try {
      const profile = await updateProfile(values);
      toast.success('Profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <RichTextField name="info" />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
