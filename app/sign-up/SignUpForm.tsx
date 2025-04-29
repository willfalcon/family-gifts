'use client';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { signUp } from './actions';
import { signUpSchema } from './signUpSchema';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { handleSignInWithFacebook, handleSignInWithGoogle } from '../sign-in/actions';

export default function SignUpForm({ afterSubmit }: { afterSubmit?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const validatedFields = signUpSchema.safeParse({ email, password, name });
      if (!validatedFields.success) {
        throw new Error('Invalid fields');
      }
      return await signUp({ email, password, name });
    },
    onSuccess: (data) => {
      toast.success('Account created successfully');
      afterSubmit?.();
    },
    onError: (error) => {
      console.log('error', error);
      toast.error('Error signing up');
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Password must be at least 8 characters long</p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I agree to the{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>} */}

        <Button type="submit" className="w-full">
          Create account
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
      </div>
    </>
  );
}
