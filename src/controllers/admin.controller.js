import { AdminService } from '../services/admin.service.js';
import { StoreService } from '../services/store.service.js';

export class AdminController {
  static async getDashboard(req, res, next) {
    try {
      const data = await AdminService.getDashboard();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(req, res, next) {
    try {
      const result = await AdminService.listUsers(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const user = await AdminService.createUser(req.body);
      res.status(201).json({ success: true, message: 'User created', data: user });
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req, res, next) {
    try {
      const user = await AdminService.getUser(req.params.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async listStores(req, res, next) {
    try {
      const result = await StoreService.listStores(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async createStore(req, res, next) {
    try {
      const store = await AdminService.createStore(req.body);
      res.status(201).json({ success: true, message: 'Store created', data: store });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const currentAdminId = req.user?.userId || req.user?.id;
      const result = await AdminService.deleteUser(req.params.id, currentAdminId);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStore(req, res, next) {
    try {
      const result = await AdminService.deleteStore(req.params.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }
}
