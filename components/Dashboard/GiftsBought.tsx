import { ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { boughtCount } from '@/prisma/queries';

type Result =
  | { success: true; message: string; items: number; bought: number }
  | { success: false; message: string; items?: number; bought?: number };
export default async function GiftsBought() {
  const { success, bought, items }: Result = (await boughtCount()) as Result;
  if (!success) {
    return null;
  }

  const progressPercent = Math.round((bought / items) * 100 * 100) / 100;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gifts Bought</CardTitle>
        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{bought}</div>
        <Progress value={progressPercent} className="mt-2" />
        <p className="text-xs text-muted-foreground mt-2">33% of your list has been bought</p>
      </CardContent>
    </Card>
  );
}
