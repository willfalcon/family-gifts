import { ControllerRenderProps, useFormContext } from 'react-hook-form';
import { Input } from './ui/input';
import { ItemSchemaType } from '@/app/dashboard/wish-lists/[id]/itemSchema';
type Props = {
  field: ControllerRenderProps<ItemSchemaType>;
};

export default function CurrencyField({ field }: Props) {
  const form = useFormContext();

  return (
    <div className="flex items-center border rounded-md relative">
      <div className="px-2 bg-muted absolute h-full left-0 flex items-center">
        <span>$</span>
      </div>
      <Input
        {...field}
        type="number"
        className="border-none pl-8 opacity-100 z-10"
        onChange={(e) => {
          form.setValue('price', parseFloat(e.target.value));
        }}
      />
    </div>
  );
}
