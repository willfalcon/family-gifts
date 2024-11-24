import { FamilyMember } from '@prisma/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function MemberAssignment({ assignment }: { assignment: FamilyMember }) {
  const [show, setShow] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Secret Santa</CardTitle>
        <CardDescription>{assignment ? 'Secret Santa Assigned' : 'No Secret Santa Assigned'}</CardDescription>
      </CardHeader>
      <CardContent>
        {show ? (
          <div className="flex gap-2 items-center">
            <p className="text-sm text-muted-foreground">{assignment.name}</p>
            <Button onClick={() => setShow(false)} variant="secondary">
              <EyeOff />
              Hide
            </Button>
          </div>
        ) : (
          <Button onClick={() => setShow(true)} variant="secondary">
            <Eye />
            Reveal
          </Button>
        )}
      </CardContent>
      <CardFooter className="gap-4">
        {show && (
          <Link className={buttonVariants({ variant: 'default' })} href={`/dashboard/family/${assignment.id}`}>
            View Wish Lists
          </Link>
        )}
        {/* Todo: After messaging is implemented, add an anonymous message option */}
        {/* <Button variant={'secondary'}>Message Anonymously</Button> */}
      </CardFooter>
    </Card>
  );
}
