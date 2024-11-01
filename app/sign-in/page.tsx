import { auth } from '@/auth';
import SignIn from '@/components/SignIn';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h2 className="text-xl font-bold">Login to use the tool.</h2>
        <SignIn />
      </main>
    </div>
  );
}
