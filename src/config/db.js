import pkg from 'pg'

const { Pool } = pkg;
let db;
const env = process.env.NODE_ENV || 'development';

async function connectDb() {
    if (db) return db;

    const config = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        ssl: {
            rejectUnauthorized: false
        }
    };

    if (env === 'development') {
        config.ssl = {
            rejectUnauthorized: false
        };
    }

    db = new Pool(config);
    await db.connect();
    return db;
}

export { connectDb, db };