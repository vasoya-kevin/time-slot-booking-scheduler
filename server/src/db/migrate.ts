import { Pool } from 'pg';
import env from '#config/enviroment.config.ts';

const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
});

const migrate = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS booking_links (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                unique_code VARCHAR(50) unique NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            )
        `)

        await client.query(` CREATE INDEX IF NOT EXISTS idx_booking_links_code ON booking_links(unique_code)`)

        await client.query(`
            CREATE TABLE IF NOT EXISTS availability_slots (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                booking_link_id INTEGER NOT NULL REFERENCES booking_links(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT valid_time_range CHECK (end_time > start_time)
            )
        `)

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_availability_link_date 
            ON availability_slots(booking_link_id, date)
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                booking_link_id INTEGER NOT NULL REFERENCES booking_links(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT valid_booking_time CHECK (end_time > start_time)
            )
        `)

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_bookings_link_date_time 
            ON bookings(booking_link_id, date, start_time, end_time)
        `);

        await client.query('COMMIT');
        console.log('✅ Database migration completed successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
};

migrate().catch(console.error);
