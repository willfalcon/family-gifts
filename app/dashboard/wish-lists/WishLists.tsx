'use client';

import { Gift, Plus, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import WishListCard from '@/components/WishListCard';
import { GetList } from '@/lib/queries/items';
import { useState } from 'react';

type Props = {
  lists: GetList[];
};

export default function WishLists({ lists }: Props) {
  const [search, setSearch] = useState('');
  // TODO: make smarter search
  const filteredLists = lists.filter((list) => list.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search wish lists..."
            className="w-full pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLists.map((list) => (
          <WishListCard key={list.id} list={list} />
        ))}
        <Card className="border-dashed flex flex-col items-center justify-center p-8">
          <Gift className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="font-medium text-center mb-2">Create a new wish list</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">Add items you'd like to receive as gifts</p>
          <Button asChild>
            <Link href="/dashboard/wish-lists/new">
              <Plus className="mr-2 h-4 w-4" />
              New List
            </Link>
          </Button>
        </Card>
      </div>
    </>
  );
}
