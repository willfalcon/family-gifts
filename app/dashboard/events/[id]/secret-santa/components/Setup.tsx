'use client';

import { ArrowRight } from 'lucide-react';

import { EventFromGetEvent } from '@/lib/queries/events';
import { useSecretSantaStore } from '../store';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTabs } from '@/components/ui/tabs';

type Props = {
  event: EventFromGetEvent;
};

export default function Setup({ event }: Props) {
  const { budget, setBudget } = useSecretSantaStore();
  const { setValue } = useTabs();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Secret Santa Settings</CardTitle>
        <CardDescription>Configure the basic settings for your Secret Santa exchange</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="budget">Budget</Label>
          <div className="flex items-center border rounded-md relative">
            <span className="px-2 bg-muted absolute h-full left-0 flex items-center rounded-l-md">$</span>
            <Input id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., $50" className="border-none pl-8" />
          </div>
          <p className="text-sm text-muted-foreground">Set a suggested budget for Secret Santa gifts</p>
        </div>

        {/* <div className="grid gap-2">
          <Label htmlFor="exchangeDate">Exchange Date</Label>
          <Input id="exchangeDate" value={event.date} onChange={(e) => setExchangeDate(e.target.value)} placeholder="e.g., December 25, 2023" />
          <p className="text-sm text-muted-foreground">When will participants exchange their Secret Santa gifts?</p>
        </div> */}
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={() => setValue('participants')}>
          Participants <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
