'use client';

import { ArrowLeft, RefreshCw, Shuffle } from 'lucide-react';

import { EventFromGetEvent } from '@/lib/queries/events';
import { formatDate } from '@/lib/utils';
import { useSecretSantaStore } from '../store';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTabs } from '@/components/ui/tabs';
import Link from 'next/link';

type Props = {
  event: EventFromGetEvent;
};

export default function Review({ event }: Props) {
  const { budget, participants, exclusions, assignments, generateAssignments, resetAssignments, showAssignments, setShowAssignments } =
    useSecretSantaStore();
  const { setValue } = useTabs();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Generate Assignments</CardTitle>
        <CardDescription>Review your Secret Santa setup and generate assignments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Settings</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget:</span>
                <span>${budget}</span>
              </div>
              {event.date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange Date:</span>
                  <span>{formatDate(event.date)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participants:</span>
                <span>{participants.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exclusions:</span>
                <span>{exclusions.length}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Participants</h3>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => {
                return (
                  participant && (
                    <Badge key={participant.id} variant="outline">
                      {participant.name}
                    </Badge>
                  )
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Assignments</h3>

          {participants.length < 2 ? (
            <div className="p-4 bg-muted rounded-md text-center">
              <p>Please select at least two participants to generate assignments.</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-4 bg-muted rounded-md text-center">
              <p>No assignments generated yet. Click the button below to generate random assignments.</p>
              <Button className="mt-4" onClick={generateAssignments}>
                <Shuffle className="mr-2 h-4 w-4" />
                Generate Assignments
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {assignments.length} Assignments
                  </Badge>
                  {showAssignments ? (
                    <Button variant="ghost" size="sm" onClick={() => setShowAssignments(false)}>
                      Hide Assignments
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setShowAssignments(true)}>
                      Show Assignments
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Regenerate Assignments?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will create new random assignments. Any existing assignments will be lost.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={generateAssignments}>Regenerate</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        Reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Assignments?</AlertDialogTitle>
                        <AlertDialogDescription>This will remove all assignments. You'll need to generate new ones.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={resetAssignments} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {showAssignments && (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Giver</TableHead>
                        <TableHead>Receiver</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment, index) => {
                        const { giver, recipient } = assignment;

                        return (
                          giver &&
                          recipient && (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={giver.image || undefined} alt={giver.name || undefined} />
                                    <AvatarFallback>
                                      {giver.name
                                        ?.split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{giver.name}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={recipient.image || undefined} alt={recipient.name || undefined} />
                                    <AvatarFallback>
                                      {recipient.name
                                        ?.split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{recipient.name}</p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="?tab=exclusions" className={buttonVariants({ variant: 'outline' })} scroll={false}>
          <ArrowLeft className="w-4 h-4" />
          Exclusions
        </Link>
      </CardFooter>
    </Card>
  );
}
