import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StoreRepository {
  static async findStores(filters, pagination, userId) {
    const { name, email, address, search } = filters;
    const { page, limit, sortBy, sortOrder } = pagination;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    } else {
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (email) where.email = { contains: email, mode: 'insensitive' };
      if (address) where.address = { contains: address, mode: 'insensitive' };
    }

    const skip = (page - 1) * limit;

    const [total, storesRaw] = await Promise.all([
      prisma.store.count({ where }),
      prisma.store.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          owner: {
            select: {
              name: true,
              email: true
            }
          },
          ratings: {
            select: {
              id: true,
              rating: true,
              review: true,
              user_id: true,
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })
    ]);

    let stores = storesRaw.map(store => {
      const totalRatings = store.ratings.length;
      const sumRatings = store.ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRatings > 0 ? parseFloat((sumRatings / totalRatings).toFixed(2)) : 0;
      
      let currentUserRating = null;
      let currentUserReview = null;
      if (userId) {
        const userRatingObj = store.ratings.find(r => r.user_id === userId);
        if (userRatingObj) {
          currentUserRating = userRatingObj.rating;
          currentUserReview = userRatingObj.review;
        }
      }

      // get 5 latest text reviews for the store
      const recentReviews = store.ratings
        .filter(r => r.review && r.review.trim() !== '')
        .map(r => ({
          userName: r.user?.name || 'Anonymous',
          rating: r.rating,
          review: r.review
        }))
        .slice(0, 5);

      const { ratings, owner, ...storeData } = store;
      return {
        ...storeData,
        ownerName: owner?.name || null,
        ownerEmail: owner?.email || null,
        averageRating,
        currentUserRating,
        currentUserReview,
        recentReviews,
      };
    });

    if (filters.minRating) {
      stores = stores.filter(s => s.averageRating >= parseFloat(filters.minRating));
    }
    if (filters.maxRating) {
      stores = stores.filter(s => s.averageRating <= parseFloat(filters.maxRating));
    }

    return { total, stores };
  }

  static async findById(id) {
    return prisma.store.findUnique({ where: { id } });
  }
}
