import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(20, 'Name must be between 20 and 60 characters').max(60, 'Name must be between 20 and 60 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  address: z.string().max(400, 'Address must be at most 400 characters').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(20, 'Name must be between 20 and 60 characters').max(60, 'Name must be between 20 and 60 characters').optional(),
  address: z.string().max(400, 'Address must be at most 400 characters').optional(),
});
