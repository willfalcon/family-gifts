'use client';

import { useForm } from "react-hook-form";
import { FamilySchema, FamilySchemaType } from "./familySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefaults } from "@/lib/utils";
import { createFamily } from "./actions";
import { toast } from "sonner";
import FamilyForm from "./FamilyForm";

type Props = {
  afterSubmit?: () => void
}

export default function NewFamily({afterSubmit}: Props) {
  const form = useForm<FamilySchemaType>({
    resolver: zodResolver(FamilySchema),
    defaultValues: getDefaults(FamilySchema),
  });

  async function onSubmit(values: FamilySchemaType) {
    try {
      const newFamily = await createFamily(values);
      if (newFamily.success) {
        toast.success('Family added!')
        form.reset();
        if (afterSubmit) {
          afterSubmit();
        }
      } else {
        toast.error(newFamily.message)
      }
    } catch(err) {
      console.error(err);
      toast.error('Something went wrong!')
    }
  }

  return (
    <FamilyForm form={form} onSubmit={onSubmit} submitText="Create Family" />
  ) 
}