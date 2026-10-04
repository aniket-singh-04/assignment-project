// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import healthRouter from './routes/health.routes.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? (process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true) : 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────────────────────
import authRouter from './routes/auth.routes.js';
import storeRouter from './routes/store.routes.js';
import adminRouter from './routes/admin.routes.js';
import ownerRouter from './routes/owner.routes.js';

app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/stores', storeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/owner', ownerRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use(notFoundMiddleware);

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorMiddleware);

export default app;
