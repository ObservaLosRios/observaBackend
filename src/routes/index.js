// routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import bancoCentralRoutes from './bancoCentralRoutes.js';
import indicadoresRoutes from './indicadoresRoutes.js';
import iniciativasRoutes from './iniciativasRoutes.js';
import noticiasRoutes from './noticiasRoutes.js';
import gobernanzaRoutes from './gobernanzaRoutes.js';

const routes = express.Router();

// Montar rutas específicas en su prefijo correspondiente
routes.use('/api/v1', authRoutes);
routes.use('/api/v1/banco-central', bancoCentralRoutes);
routes.use('/api/v1/indicadores', indicadoresRoutes);
routes.use('/api/v1/iniciativas', iniciativasRoutes);
routes.use('/api/v1/noticias', noticiasRoutes);
routes.use('/api/v1/gobernanza', gobernanzaRoutes);

// Catch-all para rutas no encontradas
routes.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default routes;