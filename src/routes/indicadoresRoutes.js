import express from 'express';
import { connectDb } from '../config/db.js';

const routes = express.Router();

routes.get('/lineamientos', async (req, res) => {
    try{
        const db = await connectDb();
        const result = await db.query('SELECT * FROM lineamiento_prf');
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No lineamientos found' });
        }

        const lineamientos = result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            created_at: row.created_at
        }));

        res.json(lineamientos);
    }      
    catch (error) {
        console.error('Error fetching lineamientos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/lineamientos/indicadores/objetivos/:id', async(req, res) => {
    try{
        const db = await connectDb();
        const { id } = req.params;
        const result = await db.query('SELECT * FROM meta where objetivo_prf_id= $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No objetivos found' });
        }

        const objetivos = result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            created_at: row.created_at
        }));

        res.json(objetivos);
    }
    catch (error) {
        console.error('Error fetching objetivos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/lineamientos/objetivos/:id', async (req, res) => {
    try{
        const db = await connectDb();
        const { id } = req.params;
        const result = await db.query('SELECT * FROM objetivo_prf where lineamiento_prf_id= $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No objetivos found' });
        }

        const objetivos = result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            created_at: row.created_at
        }));

        res.json(objetivos);
    }
    catch (error) {
        console.error('Error fetching objetivos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/objetivos/:id', async (req, res) => {
    try{
        const db = await connectDb();
        const { id } = req.params;
        const result = await db.query('select A.* from meta A where A.objetivo_prf_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Meta not found' });
        }
        const metas = result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            created_at: row.created_at
        }));

        res.json(metas);
    }
    catch (error) {
        console.error('Error fetching meta by id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/lineamientos/:id', async (req, res) => {
    try{
        const db = await connectDb();
        const { id } = req.params;
        const result = await db.query('select A.* from meta A where A.objetivo_prf_id in (select B.id from objetivo_prf B where B.lineamiento_prf_id = $1)', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Lineamiento not found' });
        }
        const metas = result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            created_at: row.created_at
        }));

        res.json(metas);
    }
    catch (error) {
        console.error('Error fetching lineamientos by id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/lineamientos/metas/:id', async (req, res) => {
    try {
        const db = await connectDb();
        const { id } = req.params;
        const result = await db.query('SELECT * FROM indicador_prf WHERE meta_id = $1 AND entorno = false AND georreferenciado = false', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Indicadores not found for this meta' });
        }

        const indicadores = result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            periodo: row.periodo,
            tipo: row.tipo,
            dimension: row.dimension,
            created_at: row.created_at,
            updated_at: row.updated_at,
            fecha_inicial: row.fecha_inicial,
        }));
        

        res.json(indicadores);

    } catch (error) {
        console.error('Error fetching indicadores:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/datos/:id', async (req, res) => {
    try {
        const db = await connectDb();
        const { id } = req.params;
        const result = await db.query('SELECT * FROM indicador_prf WHERE id = $1 and georreferenciado = false', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Datos not found for this indicador' });
        }

        const datos = result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            periodo: row.periodo,
            tipo: row.tipo,
            dimension: row.dimension,
            fuente: row.fuente,
            url: row.url,
            fecha_actualizacion: row.fecha_actualizacion,
            fecha_inicial: row.fecha_inicial,
            created_at: row.created_at,
        }));
        const labels = {
            "id": "id",
            "nombre": "Nombre",
            "descripcion": "Descripción",
            "periodo": "Periodo",
            "tipo": "Tipo",
            "dimension": "Dimensión",
            "fuente": "Fuente",
            "url": "URL",
            "fecha_actualizacion": "Fecha de Actualización",
            "fecha_inicial": "Fecha Inicial",
            "created_at": "Fecha de Creación"
        }

        res.json({datos, labels });
    } catch (error) {
        console.error('Error fetching datos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/planes/:id', async (req, res) => {
    try {
        const db = await connectDb();
        const { id } = req.params;
        const plan = await db.query('SELECT * from plan where id = $1', [id]);
        if (plan.rows.length === 0) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        const planDatos = plan.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            fin: row.fin,
            meta: row.meta,
            urlDocumento: row.url_documento,
            aprobado: row.aprobado,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            fechaAprobacion: row.fecha_aprobacion,
            objetivosEspecificos: row.objetivos_especificos,
            iniciativas: row.iniciativas
        }));

        const iniciativas = await db.query('SELECT * from iniciativa_priorizada where plan_id = $1', [id]);
        
        const iniciativaDatos = iniciativas.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            financiador: row.financiador,
            monto: row.monto,
            plazoEjecucion: row.plazo_ejecucion,
            observaciones: row.observaciones,
            anioPriorizacion: row.anio_priorizacion,
            planId: row.plan_id
        }));

        res.json({planDatos, iniciativaDatos});
    } catch (error) {
        console.error('Error in root route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/entorno', async (req, res) => {
    try {
        const db = await connectDb();
        const result = await db.query('SELECT * from indicador_prf where entorno = true and georreferenciado = false');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Indicador not found' });
        }
        const datos = result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            periodo: row.periodo,
            tipo: row.tipo,
            dimension: row.dimension,
            fuente: row.fuente,
            url: row.url,
            fecha_actualizacion: row.fecha_actualizacion,
            fecha_inicial: row.fecha_inicial,
            created_at: row.created_at,
        }));
        const labels = {
            "id": "id",
            "nombre": "Nombre",
            "descripcion": "Descripción",
            "periodo": "Periodo",
            "tipo": "Tipo",
            "dimension": "Dimensión",
            "fuente": "Fuente",
            "url": "URL",
            "fecha_actualizacion": "Fecha de Actualización",
            "fecha_inicial": "Fecha Inicial",
            "created_at": "Fecha de Creación"
        }
        res.json({datos, labels });
    } catch (error) {
        console.error('Error in root route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/notebook/:id', async (req, res) => {
    try{
        const db = await connectDb();
        const { id } = req.params;
        const result = await db.query('SELECT url_notebook from indicador_prf where id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Indicador not found' });
        }
        res.json({ url_notebook: result.rows[0].url_notebook });
    } catch (error) {
        console.error('Error fetching indicador:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/lineamientos/metas/georreferenciado/:id', async (req, res) => {
    try {
        const db = await connectDb();
        const { id } = req.params;
        const result = await db.query('SELECT * FROM indicador_prf WHERE meta_id = $1 AND entorno = false AND georreferenciado = true', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Indicadores not found for this meta' });
        }

        const indicadores = result.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            periodo: row.periodo,
            tipo: row.tipo,
            dimension: row.dimension,
            created_at: row.created_at,
            updated_at: row.updated_at,
            fecha_inicial: row.fecha_inicial,
            url: row.url,
            url_notebook: row.url_notebook,
        }));
        

        res.json(indicadores);

    } catch (error) {
        console.error('Error fetching indicadores:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default routes;