import { X } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function CategoriesField() {
  const form = useFormContext();
  const categoriesArray = useFieldArray({
    name: 'categories',
    control: form.control,
  });
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    if (newCategory && !form.getValues('categories').includes(newCategory)) {
      form.setValue('categories', [...form.getValues('categories'), newCategory]);
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    form.setValue(
      'categories',
      form.getValues('categories').filter((c: string) => c !== category),
    );
  };

  return (
    <FormField
      control={form.control}
      name="categories"
      render={({ field }) => {
        return (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {field.value.map((category: string, index: number) => {
                return (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full p-0 ml-1" onClick={() => removeCategory(category)}>
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {category}</span>
                    </Button>
                  </Badge>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCategory();
                  }
                }}
              />
              <Button type="button" onClick={addCategory}>
                Add
              </Button>
            </div>
          </div>
        );
      }}
    />
  );
}
