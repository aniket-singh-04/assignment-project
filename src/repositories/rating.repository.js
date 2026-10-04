import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RatingRepository {
  static async findByUserAndStore(userId, storeId) {
    return prisma.rating.findUnique({
      where: {
        user_id_store_id: {
          user_id: userId,
          store_id: storeId
        }
      }
    });
  }

  static async createRating(userId, storeId, ratingValue, reviewText) {
    return prisma.rating.create({
      data: {
        user_id: userId,
        store_id: storeId,
        rating: ratingValue,
        review: reviewText,
      }
    });
  }

  static async updateRating(ratingId, newRatingValue, reviewText) {
    return prisma.rating.update({
      where: { id: ratingId },
      data: { 
        rating: newRatingValue,
        review: reviewText,
      }
    });
  }
}
