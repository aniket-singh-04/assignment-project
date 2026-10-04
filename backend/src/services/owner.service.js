import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OwnerService {
  static async getDashboard(ownerId) {
    const store = await prisma.store.findUnique({
      where: { owner_id: ownerId },
      include: {
        ratings: true,
      }
    });

    if (!store) {
      const error = new Error('No store found for this owner');
      error.statusCode = 404;
      throw error;
    }

    const totalRatings = store.ratings.length;
    const sumRatings = store.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      stats: {
        totalRatings,
        averageRating: parseFloat(averageRating.toFixed(2)),
      }
    };
  }

  static async getRatings(ownerId) {
    const store = await prisma.store.findUnique({
      where: { owner_id: ownerId },
      select: { id: true }
    });

    if (!store) {
      const error = new Error('No store found for this owner');
      error.statusCode = 404;
      throw error;
    }

    const ratings = await prisma.rating.findMany({
      where: { store_id: store.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return ratings;
  }
}
