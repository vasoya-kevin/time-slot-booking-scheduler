import { Pool } from 'pg';
import dotenv from 'dotenv';
import env from '#config/enviroment.config.ts';

dotenv.config();

const pool = new Pool({
    host: env.DB_HOST || 'localhost',
    port: env.DB_PORT as number,
    database: env.DB_NAME || 'time-slot-booking-scheduler',
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || 'postgres',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Error handling for pool
pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    process.exit(-1);
});

export default pool;