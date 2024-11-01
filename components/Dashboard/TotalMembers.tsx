import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getFamilyMemberCount } from '@/prisma/queries';

export default async function TotalMembers() {
  const { count } = await getFamilyMemberCount();
  if (!count) {
    return null;
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Family Members</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="text-2xl font-bold">{count}</CardContent>
    </Card>
  );
}
