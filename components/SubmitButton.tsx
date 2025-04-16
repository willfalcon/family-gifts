'use client';

import { Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from './ui/button';

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const formStuff = useFormContext();
  const pending = formStuff.formState.isSubmitting;
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}
