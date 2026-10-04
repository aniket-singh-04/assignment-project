import { StoreRepository } from '../repositories/store.repository.js';

export class StoreService {
  static async listStores(query, userId) {
    const filters = {
      name: query.name,
      email: query.email,
      address: query.address,
      minRating: query.minRating,
      maxRating: query.maxRating,
      search: query.search
    };
    const pagination = {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder
    };

    const { total, stores } = await StoreRepository.findStores(filters, pagination, userId);

    return {
      total,
      page: pagination.page,
      limit: pagination.limit,
      data: stores
    };
  }
}
