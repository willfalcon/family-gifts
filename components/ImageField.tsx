import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { ImagePlus, X } from 'lucide-react';
import { Button } from './ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';

type Props = {
  name: string;
  label: string;
  description?: string;
  className?: string;
  previewField: string;
  tabIndex?: number;
};

export default function ImageField({ name, previewField, label, description, className, tabIndex }: Props) {
  const form = useFormContext();

  const [preview, setPreview] = useState<string | ArrayBuffer | null>(form.getValues(previewField));

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue(name, acceptedFiles[0]);
        form.clearErrors(name);
      } catch (error) {
        setPreview(null);
        form.setValue(name, null);
        form.setValue(previewField, null);
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 4500000,
    accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [] },
  });
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => {
        return (
          <FormItem>
            <FormLabel className={`${fileRejections.length !== 0 && 'text-destructive'}`}>
              {label}
              <span className={form.formState.errors.image || fileRejections.length !== 0 ? 'text-destructive' : 'text-muted-foreground'}></span>
            </FormLabel>
            <FormControl>
              <div
                {...getRootProps()}
                className={cn(
                  'relative mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 p-6 border border-input rounded-md shadow-sm',
                  className,
                )}
              >
                {/* <div className="flex items-start gap-4"> */}
                {preview && <img src={preview as string} alt="Preview" className="max-h-[400px] rounded-lg" />}
                <ImagePlus className={`size-14 text-muted-foreground ${preview ? 'hidden' : 'block'}`} />
                <Input {...getInputProps()} type="file" tabIndex={tabIndex} />
                {isDragActive ? (
                  <p className="text-sm text-muted-foreground">Drop the image!</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Click here or drag an image to upload it</p>
                )}
              </div>
            </FormControl>
            {preview && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  setPreview(null);
                  form.setValue(name, undefined);
                  form.setValue(previewField, undefined);
                }}
              >
                <X className="size-4" /> Remove
              </Button>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage>{fileRejections.length !== 0 && <p>Image must be less than 4.5MB and of type png, jpg, or jpeg</p>}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
