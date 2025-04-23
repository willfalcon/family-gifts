'use client';

import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';

export default function SignInForm() {
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
      });
    },
    onSuccess: () => {
      toast.success('Signed in successfully');
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        mutation.mutate(formData);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" type="email" required tabIndex={1} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required tabIndex={1} />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>} */}

      <Button type="submit" className="w-full" tabIndex={1}>
        {mutation.isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
