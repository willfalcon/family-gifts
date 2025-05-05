import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import QueryClientProvider from '@/providers/QueryClientProvider';
import Link from 'next/link';
import SignUpForm from './SignUpForm';

export const metadata = {
  title: 'Sign Up | Family Gifts',
  description: 'Sign up for Family Gifts',
};

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect('/dashboard');
  }

  return (
    <QueryClientProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and App Name */}
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Family Gifts</h1>
            <p className="text-muted-foreground text-center">Create an account to start managing family gifts</p>
          </div>

          <Card className="border shadow-lg">
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Enter your information to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpForm />
              {/* <Button variant="outline" size="icon" className="h-10">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button> */}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </QueryClientProvider>
  );
}
