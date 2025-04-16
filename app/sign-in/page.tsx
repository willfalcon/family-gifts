import { auth } from '@/auth';
import { Gift } from 'lucide-react';
import { redirect } from 'next/navigation';

import SignIn from '@/components/SignIn';

export default async function Home() {
  const session = await auth();
  if (session?.user?.id) {
    redirect('/dashboard');
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <Gift className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">Family Gift</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {/* <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </a> */}
        </nav>
      </header>
      <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8  items-center justify-center">
          <h2 className="text-xl font-bold">Login to use the tool.</h2>
          <SignIn />
        </main>
      </div>
    </div>
  );
}
