import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Event, FamilyMember } from '@prisma/client';
import { Gift } from 'lucide-react';
import Link from 'next/link';
import { SSMember } from './page';

type Props = {
  isManager: boolean;
  eventId: Event['id'];
  userRecipient?: SSMember | null;
  budget: number | null;
};

export default function SecretSantaBanner({ eventId, budget, isManager, userRecipient }: Props) {
  return (
    <Card className="mb-8 bg-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Secret Santa Exchange</h3>
              {budget && <p className="text-sm text-muted-foreground">Budget: ${budget}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            {isManager && (
              <Button asChild>
                <Link href={`/dashboard/events/${eventId}/secret-santa`}>Manage Secret Santa</Link>
              </Button>
            )}
            {userRecipient && (
              <Button variant="outline">
                <Link href={`/dashboard/wish-list/${userRecipient?.id}`}>View {userRecipient.name}'s Wish List</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
