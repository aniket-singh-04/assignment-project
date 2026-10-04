import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(20, 'Name must be between 20 and 60 characters').max(60, 'Name must be between 20 and 60 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  address: z.string().max(400, 'Address must be at most 400 characters').optional(),
  role: z.enum(['ADMIN', 'USER', 'OWNER']).optional(),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.enum(['name', 'email', 'role', 'created_at']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(['ADMIN', 'USER', 'OWNER']).optional(),
  search: z.string().optional(),
});
