'use client';

import { User } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

import { EventFromGetEvent } from '@/lib/queries/events';
import { formatCurrency, formatDate } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import MyAssignment from './MyAssignment';

type Props = {
  event: EventFromGetEvent;
  userId: User['id'];
  isManager: boolean;
};
export default function SecretSantaTab({ event, userId, isManager }: Props) {
  const userAssignment = event.assignments.find((assignment) => assignment.giverId === userId)?.recipient;
  const [revealed, setRevealed] = useState(false);
  return (
    <TabsContent value="secretsanta" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Secret Santa</CardTitle>
          <CardDescription>Gift exchange details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Exchange Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  {event.secretSantaBudget && (
                    <>
                      <span className="text-muted-foreground">Budget:</span>
                      <span>{formatCurrency(event.secretSantaBudget)}</span>
                    </>
                  )}
                </div>
                {event.date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exchange Date:</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participants:</span>
                  <span>{event.assignments.length}</span>
                </div>
              </div>
            </div>
            <div className="@container">
              <MyAssignment assignment={userAssignment} />
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Participants</h3>
            <div className="flex flex-wrap gap-2">
              {event.assignments.map((assignment) => (
                <Badge key={assignment.recipientId} variant="outline" className="flex items-center gap-1">
                  {assignment.recipient.name}
                  {/* <span className="text-xs text-muted-foreground ml-1">({assignment.recipient.family})</span> */}
                </Badge>
              ))}
            </div>
          </div>
          {isManager && (
            <div className="pt-4 border-t">
              <Link href={`/dashboard/events/${event.id}/secret-santa`} className={buttonVariants()}>
                Manage Secret Santa
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
