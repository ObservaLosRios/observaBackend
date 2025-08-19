import express from 'express';
import { connectDb } from '../config/db.js';

const routes = express.Router();
routes.get('/', async (req, res) => {
    try {
        const db = await connectDb();
        const result = await db.query('SELECT * FROM gobernanza');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching gobernanza:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default routes;