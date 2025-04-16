import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MemberCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
        <div className="flex flex-1 items-center space-x-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <Skeleton className="h-4 w-[50px] rounded-full" />
          <Skeleton className="h-3 w-[75px]" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-2">
        <Skeleton className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'h-4 w-[100px]' })} />
        <Skeleton className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'h-4 w-[100px]' })} />
      </CardFooter>
    </Card>
  );
}
