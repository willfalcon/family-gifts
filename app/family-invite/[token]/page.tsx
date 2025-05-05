import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import SignIn from '@/components/SignIn';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import QueryClientProvider from '@/providers/QueryClientProvider';
import { Check, Gift, Info, Users } from 'lucide-react';
import { cache } from 'react';
import { getFamilyByInviteLinkToken } from './actions';
import JoinButton from './JoinButton';

type Props = { params: { token: string } };

const getFamily = cache(async (token: string) => {
  const family = await getFamilyByInviteLinkToken(token);
  return family;
});

export async function generateMetadata({ params }: Props) {
  const { token } = params;
  if (!token) {
    return {
      title: 'Family Invite | Family Gifts',
      description: 'Family Invite on Family Gifts',
    };
  }
  const family = await getFamily(token);
  return {
    title: `Join ${family.name} | Family Gifts`,
    description: `Join ${family.name} on Family Gifts`,
  };
}

export default async function FamilyInvitePage({ params }: Props) {
  const { token } = params;
  if (!token) {
    notFound();
  }

  const session = await auth();
  const family = await getFamily(token);

  if (family.inviteLinkExpiry && family.inviteLinkExpiry < new Date()) {
    notFound();
  }

  return (
    <QueryClientProvider>
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join the Family</CardTitle>
              <CardDescription>You&apos;ve been invited to join a family group.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 border-b pb-6">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{family.name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="flex flex-col items-center justify-center space-y-1 rounded-lg border p-4">
                  <Users className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xl font-bold">{family?._count.members}</span>
                  <span className="text-xs text-muted-foreground">Members</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-1 rounded-lg border p-4">
                  <Gift className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xl font-bold">{family?._count.visibleLists}</span>
                  <span className="text-xs text-muted-foreground">Wish Lists</span>
                </div>
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
                  <span className="text-xl font-bold">{family?._count.events}</span>
                  <span className="text-xs text-muted-foreground">Events</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">By joining this family, you&apos;ll be able to:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    View and create wish lists
                  </li>

                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Participate in family gift-giving events
                  </li>

                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Coordinate gift purchases with other family members
                  </li>
                </ul>
              </div>
              {family.requireApproval && (
                <Alert variant="default">
                  <AlertDescription className="flex items-center">
                    <Info className="h-4 w-4 mr-2" /> A manager will have to approve your request to join the family.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              {!session?.user?.id ? (
                <>
                  <h2>Make an account or sign in to join.</h2>
                  <SignIn />
                </>
              ) : (
                <JoinButton familyName={family.name} familyId={family.id} userId={session.user.id} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </QueryClientProvider>
  );
}
