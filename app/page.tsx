import { auth } from '@/auth';
import { Calendar, Gift, Lock, Users } from 'lucide-react';
import Link from 'next/link';

import SignIn from '@/components/SignIn';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const session = await auth();

  // TODO: add site and page titles

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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">Simplify Family Gift-Giving</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Organize wish lists, plan events, and manage Secret Santa exchanges all in one place. Make every family gathering special.
                </p>
              </div>
              <div className="space-x-4">
                {!session?.user ? (
                  <SignIn />
                ) : (
                  <Link href="/dashboard" className={buttonVariants()}>
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Key Features</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Gift className="h-10 w-10 mb-2" />
                  <CardTitle>Wish Lists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create and share personalized wish lists with your family members.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 mb-2" />
                  <CardTitle>Family Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Easily add and manage family members in your gift-giving circle.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-10 w-10 mb-2" />
                  <CardTitle>Event Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Organize family gatherings and track gift-giving occasions.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Lock className="h-10 w-10 mb-2" />
                  <CardTitle>Secret Santa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Set up and manage Secret Santa exchanges with custom rules.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Simplify Your Family Gift-Giving?</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of families (imaginary, so far) who have made their gift-giving experiences more enjoyable and organized.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 FamilyGift. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy-policy">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   {session?.user ? <h1>Add people</h1> : <h1>Start a new family account</h1>}
    //   {!session?.user && <SignIn />}
    // </div>
  );
}
