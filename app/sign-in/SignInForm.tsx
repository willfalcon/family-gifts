'use client';

import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { handleSignInWithFacebook, handleSignInWithGoogle } from './actions';

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
  function getErrorMessage(error: string | null) {
    if (!error) return null;
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid credentials';
      case 'OAuthAccountNotLinked':
        return 'Another account already exists with that email';
      default:
        return 'Something went wrong';
    }
  }
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = getErrorMessage(error);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
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

        {errorMessage && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{errorMessage}</div>}

        <Button type="submit" className="w-full" tabIndex={1}>
          {mutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        {/* {Object.values(providerMap).map((provider) => (
                <form action={() => handleSignInWithProvider(provider.id)}>
                  <Button type="submit" variant="outline" size="icon" className="h-10">
                    <provider.icon className="h-4 w-4" />
                    <span className="sr-only">{provider.name}</span>
                  </Button>
                </form>
              ))} */}
        <form action={handleSignInWithFacebook}>
          <Button variant="outline" size="icon" className="h-10" type="submit">
            <FaFacebookF className="h-4 w-4" />
            <span className="sr-only">Facebook</span>
          </Button>
        </form>
        <form action={handleSignInWithGoogle}>
          <Button variant="outline" size="icon" className="h-10" type="submit">
            <FaGoogle className="h-4 w-4" />
            <span className="sr-only">Google</span>
          </Button>
        </form>
        {/* <Button variant="outline" size="icon" className="h-10">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button> */}
      </div>
    </>
  );
}
