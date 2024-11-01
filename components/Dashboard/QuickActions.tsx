import { CalendarDays, Gift, PlusCircle, Settings } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';

export default function QuickActions({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used functions</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/wish-list" className={buttonVariants({ className: 'w-full justify-start' })}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Wish List Item
        </Link>
        <Link href="/dashboard/family" className={buttonVariants({ className: 'w-full justify-start' })}>
          <Gift className="mr-2 h-4 w-4" />
          View Family Lists
        </Link>
        <Link href="/dashboard/events/new" className={buttonVariants({ className: 'w-full justify-start' })}>
          <CalendarDays className="mr-2 h-4 w-4" />
          Create New Event
        </Link>
        <Link href="/dashboard/manage-family" className={buttonVariants({ className: 'w-full justify-start' })}>
          <Settings className="mr-2 h-4 w-4" />
          Manage Settings
        </Link>
      </CardContent>
    </Card>
  );
}
