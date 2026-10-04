import { z } from 'zod';

export const submitRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().max(1000).optional(),
});

export const updateRatingSchema = submitRatingSchema;
