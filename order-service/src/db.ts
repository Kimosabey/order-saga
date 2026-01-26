import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'ordersaga_db',
    password: process.env.POSTGRES_PASSWORD || 'password123',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDb = async () => {
    await query(`
        CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            item VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("✅ Postgres Database Initialized");
};
