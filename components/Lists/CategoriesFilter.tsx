import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

type Props = {
  categories: string[];

  active: string[];
};
export default function CategoriesFilter({ categories, active }: Props) {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2 flex flex-col">
            <Link className={buttonVariants({ variant: !active.length ? 'secondary' : 'ghost', className: '!justify-start' })} href={`?`}>
              All
            </Link>
            {categories.map((category) => {
              const newCats = active.includes(category) ? active.filter((c) => c !== category) : [...active, category].join(',');
              return (
                <Link
                  key={category}
                  className={buttonVariants({ variant: active.includes(category) ? 'secondary' : 'ghost', className: '!justify-start' })}
                  href={`?category=${newCats}`}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
