import { OwnerService } from '../services/owner.service.js';

export class OwnerController {
  static async getDashboard(req, res, next) {
    try {
      const ownerId = req.user.userId;
      const data = await OwnerService.getDashboard(ownerId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getRatings(req, res, next) {
    try {
      const ownerId = req.user.userId;
      const data = await OwnerService.getRatings(ownerId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
