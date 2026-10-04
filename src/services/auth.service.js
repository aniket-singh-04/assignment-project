import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';

export class AuthService {
  static async register(data) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const newUser = await UserRepository.createUser({
      name: data.name,
      email: data.email,
      password_hash,
      address: data.address,
      role: 'USER', // Default role
    });

    const { password_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';
    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    const { password_hash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async changePassword(userId, oldPassword, newPassword) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      const error = new Error('Incorrect old password');
      error.statusCode = 401;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await UserRepository.updatePassword(userId, password_hash);
    return true;
  }

  static async updateProfile(userId, updateData) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    const updatedUser = await UserRepository.updateProfile(userId, updateData);
    return updatedUser;
  }
}
