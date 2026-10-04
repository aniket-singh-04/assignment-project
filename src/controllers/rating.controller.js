import { RatingService } from '../services/rating.service.js';

export class RatingController {
  static async submitRating(req, res, next) {
    try {
      const userId = req.user.userId;
      const { storeId } = req.params;
      const { rating, review } = req.body;

      const newRating = await RatingService.submitRating(userId, storeId, rating, review);
      res.status(201).json({
        success: true,
        message: 'Rating submitted successfully',
        data: newRating
      });
    } catch (error) {
      next(error);
    }
  }

  static async modifyRating(req, res, next) {
    try {
      const userId = req.user.userId;
      const { storeId } = req.params;
      const { rating, review } = req.body;

      const updatedRating = await RatingService.modifyRating(userId, storeId, rating, review);
      res.status(200).json({
        success: true,
        message: 'Rating updated successfully',
        data: updatedRating
      });
    } catch (error) {
      next(error);
    }
  }
}
