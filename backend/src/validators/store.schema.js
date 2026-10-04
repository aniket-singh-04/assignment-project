import { z } from 'zod';

export const storeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.enum(['name', 'created_at']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxRating: z.coerce.number().min(0).max(5).optional(),
  search: z.string().optional(),
});

export const createStoreSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  address: z.string().max(400).optional(),
  owner_id: z.string().optional(),
  ownerId: z.string().optional(),
  ownerEmail: z.string().email().optional(),
});
