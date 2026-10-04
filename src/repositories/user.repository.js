import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  static async createUser(data) {
    return prisma.user.create({ data });
  }

  static async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async updatePassword(id, password_hash) {
    return prisma.user.update({
      where: { id },
      data: { password_hash },
    });
  }

  static async updateProfile(id, updateData) {
    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        created_at: true,
        updated_at: true,
      }
    });
  }
}
