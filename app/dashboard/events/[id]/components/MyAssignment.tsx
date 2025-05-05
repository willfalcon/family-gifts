'use client';

import { Eye, EyeOff, Gift } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Recipient } from '@/lib/queries/events';
import { cn } from '@/lib/utils';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';

type Props = {
  assignment?: Recipient;
};

export default function MyAssignment({ assignment }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="@container">
      {assignment ? (
        <div className="p-4 bg-primary/5 rounded-md border border-primary/20">
          <p className="text-center mb-2">Your Secret Santa assignment:</p>
          <div className="relative my-4">
            <div className="relative overflow-hidden rounded-md bg-white/50 p-3 pb-6 transition-all duration-500 @3xl:flex @3xl:flex-row @3xl:items-center justify-center gap-10">
              <div className="flex flex-col items-center">
                {assignment.image && (
                  <Avatar className={cn('w-16 h-16 mb-2 text-center transition-all duration-500', { 'blur-md select-none': !revealed })}>
                    <AvatarImage src={assignment.image} alt={assignment.name || undefined} />
                  </Avatar>
                )}
                <p className={`text-xl font-bold text-center transition-all duration-500 ${!revealed ? 'blur-md select-none' : ''}`}>
                  {assignment.name}
                </p>
              </div>
              <div className={cn('blur-md overflow-hidden transition-all duration-500', { 'blur-none': revealed })}>
                {!!assignment?.lists.length ? (
                  <div className="mt-4 text-center">
                    {/* <h4 className="font-medium mb-2">Their Lists</h4> */}
                    {assignment.lists.map((list) => (
                      <div key={list.id}>
                        <Link href={`/dashboard/wish-lists/${list.id}`} className={buttonVariants({ variant: 'outline' })}>
                          <Gift className="mr-2 h-4 w-4" />
                          {list.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 text-center">
                    <p className="text-muted-foreground">No wish lists yet.</p>
                    <Button>Message Anonymously</Button>
                  </div>
                )}
              </div>
              {!revealed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 via-green-100/50 to-red-100/50 animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <Gift className="h-8 w-8 text-primary/40 animate-bounce" />
                  </div>
                </div>
              )}
            </div>
            {/* Reveal Button */}
            <button
              onClick={() => setRevealed((prev) => !prev)}
              className={cn(
                'absolute left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full shadow-md text-sm font-medium transition-all duration-300',
                {
                  '-bottom-4 bg-muted hover:bg-muted/80': revealed,
                  'bottom-1/2 translate-y-12 bg-primary text-primary-foreground hover:bg-primary/90': !revealed,
                },
              )}
            >
              {revealed ? (
                <span className="flex items-center gap-2">
                  <EyeOff className="mr-1 h-4 w-4" />
                  Hide
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Eye className="mr-1 h-4 w-4" />
                  Reveal
                </span>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-muted rounded-md">
          <p className="text-center text-muted-foreground">You are not participating in this Secret Santa exchange.</p>
        </div>
      )}
    </div>
  );
}
