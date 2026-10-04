// src/config/database.js
import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance for the whole app
const prisma = new PrismaClient();

export default prisma;
