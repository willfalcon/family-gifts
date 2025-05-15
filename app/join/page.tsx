import { auth } from '@/auth';
import { notFound } from 'next/navigation';

import { getInvite } from '@/lib/queries/onboarding';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import QueryClientProvider from '@/providers/QueryClientProvider';
import { Check, Gift, Users } from 'lucide-react';
import JoinButton from './JoinButton';
import SignInOrJoin from './SignInOrJoin';

type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
};

export async function generateMetadata({ searchParams }: PageProps) {
  const { token } = searchParams;

  if (!token) {
    return {
      title: 'Join | Family Gifts',
      description: 'Join a family or event on Family Gifts',
      robots: {
        index: false,
      },
    };
  }
  const invite = await getInvite(token);
  return {
    title: `${invite.family?.name || invite.event?.name} | Family Gifts`,
    description: `Join ${invite.family?.name || invite.event?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  };
}

export default async function JoinPage({ searchParams }: PageProps) {
  const { token } = searchParams;

  if (!token) {
    notFound();
  }

  const session = await auth();

  const invite = await getInvite(token);

  const inviteType = invite.event ? 'Event' : 'Family';

  return (
    <QueryClientProvider>
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{inviteType} Invitation</CardTitle>
              <CardDescription>You&apos;ve been invited to {inviteType === 'Event' ? `an event.` : `join a family group.`}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 border-b pb-6">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{invite.family?.name || invite.event?.name}</h2>
                  {invite.createdAt && (
                    <p className="text-sm text-muted-foreground">Invitation sent {new Date(invite.createdAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {invite.inviter && (
                    <>
                      <Avatar>
                        <AvatarImage src={invite.inviter.image || undefined} alt={invite.inviter.name || ''} />
                        <AvatarFallback>
                          {invite.inviter.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{invite.inviter.name} invited you</p>
                        <p className="text-sm text-muted-foreground">{invite.inviter.email}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="flex flex-col items-center justify-center space-y-1 rounded-lg border p-4">
                  <Users className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xl font-bold">{invite.family?._count.members || invite.event?._count.attendees}</span>
                  <span className="text-xs text-muted-foreground">{inviteType === 'Family' ? 'Members' : 'Attendees'}</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-1 rounded-lg border p-4">
                  <Gift className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xl font-bold">{invite.family?._count.visibleLists || invite.event?._count.visibleLists || 0}</span>
                  <span className="text-xs text-muted-foreground">Wish Lists</span>
                </div>
                {inviteType === 'Family' && (
                  <div className="flex flex-col items-center justify-center space-y-1 rounded-lg border p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-muted-foreground mb-1"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <span className="text-xl font-bold">{invite.family?._count.events}</span>
                    <span className="text-xs text-muted-foreground">Events</span>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">By joining this {inviteType === 'Family' ? 'family' : 'event'}, you&apos;ll be able to:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    View and create wish lists
                  </li>
                  {inviteType === 'Family' && (
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      Participate in family gift-giving events
                    </li>
                  )}
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Coordinate gift purchases with other {inviteType === 'Family' ? 'family members' : 'event attendees'}
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full max-w-md mx-auto">
                {!session?.user ? (
                  <SignInOrJoin redirectUrl={`/join?token=${token}`} />
                ) : (
                  <JoinButton name={invite.family?.name || invite.event?.name || ''} invite={invite} inviteType={inviteType} />
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </QueryClientProvider>
  );
}
