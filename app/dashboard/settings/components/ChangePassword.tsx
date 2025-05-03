'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { passwordErrors, passwordSchema, PasswordSchemaType } from '../profileSchema';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changePassword, setPassword } from '../actions';

type Props = {
  hasPassword: boolean;
};

export default function ChangePassword({ hasPassword }: Props) {
  const form = useForm<PasswordSchemaType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', newPassword: '', confirmPassword: '' },
  });

  console.log(form.formState.errors);
  const mutation = useMutation({
    mutationFn: async (data: PasswordSchemaType) => {
      if (hasPassword) {
        return await changePassword(data);
      }
      return await setPassword(data);
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      form.reset();
    },
    onError: (err) => {
      toast.error('Failed to change password');
      if (err.message === passwordErrors.PASSWORD_REQUIRED) {
        form.setError('password', { message: passwordErrors.PASSWORD_REQUIRED });
      } else if (err.message === passwordErrors.PASSWORD_INCORRECT) {
        form.setError('password', { message: passwordErrors.PASSWORD_INCORRECT });
      } else if (err.message === passwordErrors.PASSWORD_MISMATCH) {
        form.setError('confirmPassword', { message: passwordErrors.PASSWORD_MISMATCH });
      } else {
        console.log(err);
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function onSubmit(data: PasswordSchemaType) {
    mutation.mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hasPassword ? 'Change Password' : 'Set Password'}</CardTitle>
        <CardDescription>{hasPassword ? 'Update your password' : 'Set a password for your account'}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {hasPassword && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} type={showPassword ? 'text' : 'password'} tabIndex={1} />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            tabIndex={2}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type={showNewPassword ? 'text' : 'password'} tabIndex={1} />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                          tabIndex={2}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type={showConfirmPassword ? 'text' : 'password'} tabIndex={1} />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          tabIndex={2}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" tabIndex={1}>
              Change Password
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
