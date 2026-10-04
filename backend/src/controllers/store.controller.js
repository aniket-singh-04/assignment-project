import { StoreService } from '../services/store.service.js';

export class StoreController {
  static async listStores(req, res, next) {
    try {
      const result = await StoreService.listStores(req.query, req.user?.userId);
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
}
