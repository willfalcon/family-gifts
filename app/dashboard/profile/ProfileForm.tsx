'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ProfileSchema, ProfileSchemaType } from './profileSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { updateProfile } from './actions';
import { FamilyMember } from '@prisma/client';
import InfoField from '../events/InfoField';

interface ProfileFormProps {
  profile: FamilyMember;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: profile.name, email: profile.email },
  });
  async function onSubmit(values: ProfileSchemaType) {
    console.log(values);
    try {
      const profile = await updateProfile(values);
      if (profile.success) {
        toast.success(profile.message);
      } else {
        toast.error(profile.message);
      }
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
        <InfoField />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
