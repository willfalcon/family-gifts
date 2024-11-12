import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getItems } from '@/lib/queries/items';

export default async function MyList() {
  const { items, success } = await getItems(3);

  if (!success || !items?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wish List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {items?.map((item) => (
            <li key={item.id}>
              <h3>{item.name}</h3>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/dashboard/wish-list">Edit List</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
