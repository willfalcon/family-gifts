import { markItemAsBought, unmarkItemAsBought } from '@/app/dashboard/family/actions';
import { Button } from '../ui/button';
import { Item } from '@prisma/client';
import { toast } from 'sonner';
import { ItemWithRefs } from '@/prisma/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { useMe } from '@/app/dashboard/Providers';

type Props = {
  id: Item['id'];
  bought: ItemWithRefs['boughtBy'] | undefined;
};

export default function MarkAsBought({ id, bought }: Props) {
  const { data: me } = useMe();
  const boughtByMe = bought?.some((b) => b.id === me?.id);
  return bought?.length ? (
    <div className="flex items-center">
      {boughtByMe ? (
        <Button
          variant="outline"
          className={'rounded-r-none'}
          onClick={async () => {
            try {
              const res = await unmarkItemAsBought(id);
              if (res.success) {
                toast.success(res.message);
              } else {
                toast.error(res.message);
              }
            } catch (err) {
              console.error(err);
              toast.error('Something went wrong.');
            }
          }}
        >
          Unmark as bought
        </Button>
      ) : (
        <Button variant="outline" className={'rounded-r-none'}>
          Bought By {bought[0].name}
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={'rounded-l-none border-l-0 px-2'}>
            <CaretDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Bought by {bought.map((m) => m.name).join(', ')}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={async () => {
              try {
                const res = await markItemAsBought(id);
                if (res.success) {
                  toast.success(res.message);
                } else {
                  toast.error(res.message);
                }
              } catch (err) {
                console.error(err);
              }
            }}
          >
            I also bought this
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Message other buyers</DropdownMenuItem> */}
          {/* <DropdownMenuItem>Create thingy</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <Button
      variant="outline"
      onClick={async () => {
        try {
          const res = await markItemAsBought(id);
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        } catch (err) {
          console.error(err);
        }
      }}
    >
      Mark as bought
    </Button>
  );
}

// export default function MarkAsBought({ id, bought }: Props) {
//   return bought?.length ? (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Badge variant="outline">Bought</Badge>
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>Bought by {bought.map((m) => m.name).join(', ')}</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   ) : (
//     <Button
//       variant="outline"
//       onClick={async () => {
//         try {
//           const res = await markItemAsBought(id);
//           if (res.success) {
//             toast.success(res.message);
//           } else {
//             toast.error(res.message);
//           }
//         } catch (err) {
//           console.error(err);
//           toast.error('Something went wrong.');
//         }
//       }}
//     >
//       Mark as Bought
//     </Button>
//   );
// }
