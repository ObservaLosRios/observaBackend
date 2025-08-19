import express from 'express';
import { connectDb } from '../config/db.js';

const routes = express.Router();

routes.get('/', async (req, res) => {
    try {
        const db = await connectDb();
        const result = await db.query('SELECT * FROM noticias order by fecha_publicacion desc');
        const noticias = result.rows;
        res.json(noticias);
    } catch (error) {
        console.error('Error fetching noticias:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
routes.get('/etiquetas', async (req, res) => {
    try {
        const db = await connectDb();
        const etiquetas = await db.query('SELECT * FROM etiquetas');
        const result = etiquetas.rows;
        res.json(result);
    } catch (error) {
        console.error('Error fetching etiquetas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

routes.get('/etiquetas_noticias', async (req, res) => {
    try {
        const db = await connectDb();
        const noticia_etiquetas = await db.query('SELECT * FROM noticia_etiquetas');
        if (!noticia_etiquetas) {
            return res.status(404).json({ error: 'Noticia not found' });
        }
        const result = noticia_etiquetas.rows;
        res.json(result);
    } catch (error) {
        console.error('Error fetching noticias_etiquetas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

routes.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await connectDb();
        const result = await db.query('SELECT * FROM noticias WHERE id = $1', [id]);
        const noticia = result.rows[0];
        if (!noticia) {
            return res.status(404).json({ error: 'Noticia not found' });
        }
        
        const fotos = await db.query('SELECT url, alt_text, caption, orden, es_principal FROM imagenes_noticias WHERE noticia_id = $1 order by orden asc', [id]);
        noticia.fotos = fotos.rows;
        res.json(noticia);
    } catch (error) {
        console.error('Error fetching noticias:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default routes;
