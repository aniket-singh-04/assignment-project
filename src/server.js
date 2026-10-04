// src/server.js
import 'dotenv/config';
import dns from 'node:dns';
import pg from 'pg';
import app from './app.js';

// Force Node.js to resolve IPv4 addresses first to avoid ENETUNREACH on IPv6-only DNS responses
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const connectionString = process.env.DATABASE_URL;

  const dbClient = new pg.Client({
    connectionString,
    ssl: connectionString?.includes('sslmode=require') || connectionString?.includes('supabase') || connectionString?.includes('neon') || isProduction
      ? { rejectUnauthorized: false }
      : false,
  });

  try {
    console.log('⏳  Connecting to the database...');
    await dbClient.connect();
    console.log('✅  Database connected successfully');
    await dbClient.end(); // We only need it for the check right now
    
    server = app.listen(PORT, () => {
      console.log(`✅  Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌  Database connection failed. Server will not start.');
    console.error(error.message);
    process.exit(1);
  }
};

startServer();

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n🛑  Received ${signal}. Shutting down gracefully…`);
  if (server) {
    server.close(() => {
      console.log('🔒  HTTP server closed.');
      process.exit(0);
    });

    // Force shutdown after 10 s if connections hang
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

