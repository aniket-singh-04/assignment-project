import { RatingRepository } from '../repositories/rating.repository.js';
import { StoreRepository } from '../repositories/store.repository.js';

export class RatingService {
  static async submitRating(userId, storeId, ratingValue, reviewText) {
    const store = await StoreRepository.findById(storeId);
    if (!store) {
      const error = new Error('Store not found');
      error.statusCode = 404;
      throw error;
    }

    const existingRating = await RatingRepository.findByUserAndStore(userId, storeId);
    if (existingRating) {
      const error = new Error('You have already rated this store. Use PATCH to modify.');
      error.statusCode = 409;
      throw error;
    }

    return RatingRepository.createRating(userId, storeId, ratingValue, reviewText);
  }

  static async modifyRating(userId, storeId, newRatingValue, reviewText) {
    const existingRating = await RatingRepository.findByUserAndStore(userId, storeId);
    if (!existingRating) {
      const error = new Error('Rating not found');
      error.statusCode = 404;
      throw error;
    }

    return RatingRepository.updateRating(existingRating.id, newRatingValue, reviewText);
  }
}
