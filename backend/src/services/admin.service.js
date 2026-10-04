import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminService {
  static async getDashboard() {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return { usersCount, storesCount, ratingsCount };
  }

  static async listUsers(query) {
    const { page, limit, sortBy, sortOrder, name, email, address, role, search } = query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
      // Role is an enum, exact match only
      const upperSearch = search.toUpperCase();
      if (['ADMIN', 'USER', 'OWNER'].includes(upperSearch)) {
        where.OR.push({ role: upperSearch });
      }
    } else {
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (email) where.email = { contains: email, mode: 'insensitive' };
      if (address) where.address = { contains: address, mode: 'insensitive' };
      if (role) where.role = role;
    }

    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
          created_at: true,
          updated_at: true,
          store: {
            select: {
              ratings: { select: { rating: true } }
            }
          }
        }
      })
    ]);

    const mappedUsers = users.map(user => {
      let storeRating = null;
      if (user.role === 'OWNER' && user.store) {
        const totalRatings = user.store.ratings.length;
        if (totalRatings > 0) {
          const sumRatings = user.store.ratings.reduce((sum, r) => sum + r.rating, 0);
          storeRating = parseFloat((sumRatings / totalRatings).toFixed(2));
        } else {
          storeRating = 0;
        }
      }
      const { store, ...rest } = user;
      return { ...rest, storeRating };
    });

    return { total, page, limit, data: mappedUsers };
  }

  static async createUser(data) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      const error = new Error('Email already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash,
        address: data.address,
        role: data.role || 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      }
    });

    return user;
  }

  static async getUser(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, address: true, role: true, created_at: true, updated_at: true
      }
    });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  static async createStore(data) {
    const ownerIdInput = data.owner_id || data.ownerId;
    const ownerEmailInput = data.ownerEmail;

    const existingStore = await prisma.store.findUnique({ where: { email: data.email } });
    if (existingStore) {
      const error = new Error('Store email already exists');
      error.statusCode = 409;
      throw error;
    }

    let owner = null;
    if (ownerEmailInput) {
      owner = await prisma.user.findUnique({ where: { email: ownerEmailInput } });
    } else if (ownerIdInput) {
      if (ownerIdInput.includes('@')) {
        owner = await prisma.user.findUnique({ where: { email: ownerIdInput } });
      } else {
        owner = await prisma.user.findUnique({ where: { id: ownerIdInput } });
      }
    }

    if (!owner) {
      const error = new Error('Selected owner user was not found');
      error.statusCode = 400;
      throw error;
    }

    if (owner.role !== 'OWNER') {
      const error = new Error('Selected user does not have OWNER role. Only users with OWNER role can be assigned as a store owner.');
      error.statusCode = 400;
      throw error;
    }

    const store = await prisma.store.create({
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        owner_id: owner.id,
      }
    });
    return store;
  }

  static async deleteUser(targetUserId, currentAdminId) {
    if (targetUserId === currentAdminId) {
      const error = new Error('Super admin cannot delete their own account');
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete all stores owned by this user and all ratings for those stores
      const stores = await tx.store.findMany({ where: { owner_id: targetUserId } });
      for (const store of stores) {
        await tx.rating.deleteMany({ where: { store_id: store.id } });
        await tx.store.delete({ where: { id: store.id } });
      }

      // 2. Delete all ratings created by this user
      await tx.rating.deleteMany({ where: { user_id: targetUserId } });

      // 3. Delete the user
      await tx.user.delete({ where: { id: targetUserId } });
    });

    return { message: 'User and all associated data deleted successfully' };
  }

  static async deleteStore(storeId) {
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      const error = new Error('Store not found');
      error.statusCode = 404;
      throw error;
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete all ratings for this store
      await tx.rating.deleteMany({ where: { store_id: storeId } });

      // 2. Delete the store
      await tx.store.delete({ where: { id: storeId } });
    });

    return { message: 'Store and all associated ratings deleted successfully' };
  }
}
