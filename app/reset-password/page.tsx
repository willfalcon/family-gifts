import { getUserByResetPasswordToken } from '@/lib/queries/user';
import QueryClientProvider from '@/providers/QueryClientProvider';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ResetPasswordForm from './ResetPasswordForm';

type Props = {
  searchParams: {
    token: string;
  };
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = searchParams;

  if (!token) {
    notFound();
  }

  const user = await getUserByResetPasswordToken(token);

  if (!user || (user.resetPasswordTokenExpiry && user.resetPasswordTokenExpiry < new Date())) {
    notFound();
  }

  return (
    <QueryClientProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <div className="w-full max-w-md space-y-8">
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
            <h1 className="text-3xl font-bold">Reset your password</h1>
            <p className="text-muted-foreground text-center">Set a new password</p>
          </div>
          <ResetPasswordForm token={token} />
          <div className="text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-1">
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms
              </Link>
              <span>·</span>
              <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-primary">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
