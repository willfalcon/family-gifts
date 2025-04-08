import Link from 'next/link';
import { Plus, Search, Users } from 'lucide-react';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { getFamilies } from '@/lib/queries/families';

import Title, { SubTitle } from '@/components/Title';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';

export default async function FamiliesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  const families = await getFamilies();

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs items={[{ name: 'Families', href: '/dashboard/families' }]} />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Families</Title>
          <SubTitle>Manage your family groups and invitations</SubTitle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/families/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Family
          </Link>
        </div>
      </div>

      {/* TODO: Implement family search */}
      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search families..." className="w-full pl-8" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {families.map((family) => {
          const creator = family.creatorId === session.user?.id ? 'you' : family.creator.name;

          return (
            <Card>
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
        })}
        <Card className="border-dashed flex flex-col items-center justify-center p-8">
          <Users className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="font-medium text-center mb-2">Create a new family</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">Start a new family group and invite members</p>

          <Link href="/dashboard/families/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            New Family
          </Link>
        </Card>
      </div>
    </div>
  );
}
