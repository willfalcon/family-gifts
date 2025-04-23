import { z } from 'zod';

export const ProfileSchema = z.object({
  name: z.string().min(1).default(''),
  email: z.string().email().default(''),
  info: z.any().optional(),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;

export const passwordSchema = z.object({
  password: z.string().default('').optional(),
  newPassword: z.string().min(8).default(''),
  confirmPassword: z.string().min(8).default(''),
});

export type PasswordSchemaType = z.infer<typeof passwordSchema>;

export const passwordErrors = {
  PASSWORD_REQUIRED: 'Current password is required',
  PASSWORD_INCORRECT: 'Current password is incorrect',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PASSWORD_WEAK: 'Password must be at least 8 characters long',
};
