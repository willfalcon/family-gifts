'use client';

import { Button } from '@/components/ui/button';
import { useMe } from '@/hooks/use-me';
import { GetFamilies } from '@/lib/queries/families';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

export default function FamilyCard({ family }: { family: GetFamilies }) {
  const { data: me } = useMe();
  const creator = family.creatorId === me?.id ? 'you' : family.creator.name;
  return (
    <Card key={family.id}>
      <CardHeader>
        <CardTitle>{family.name}</CardTitle>
        <CardDescription>Created by {creator}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span>{family._count.members} members</span>
          {/* <span>3 upcoming events</span>
              <span className="text-muted-foreground">5 wish lists</span> */}
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full" asChild>
          <Link href={`/dashboard/families/${family.id}`}>View Family</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
