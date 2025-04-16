import { Gift } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SetupSecretSanta({ eventId }: { eventId: string }) {
  return (
    <Card className="mb-8 bg-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/dashboard/events/${eventId}/secret-santa`} className={buttonVariants({})}>
              Setup Secret Santa
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
