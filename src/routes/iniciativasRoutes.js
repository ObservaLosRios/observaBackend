import express from 'express';
import { connectDb } from '../config/db.js';

const routes = express.Router();

routes.get('/iniciativa_compfin/:planId', async (req, res) => {
    try {
        const db = await connectDb();
        const { planId } = req.params;
        const result = await db.query('SELECT * FROM iniciativa_comp_finan WHERE plan_id = $1', [planId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron iniciativas para este plan' });
        }

        const iniciativas = result.rows.map(iniciativa => ({
            id: iniciativa.id,
            numero: iniciativa.numero,
            nombre: iniciativa.nombre,
            duracion: iniciativa.duracion,
            monto_total: iniciativa.monto_total,
            anio1: iniciativa.anio1,
            anio2: iniciativa.anio2,
            anio3: iniciativa.anio3,
            plan_id: iniciativa.plan_id
        }));

        res.json(iniciativas); // Devolver array de iniciativas
    } catch (error) {
        console.error('Error fetching iniciativas:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/iniciativa_historica/:planId', async (req, res) => {
    try {
        const db = await connectDb();
        const { planId } = req.params;
        const result = await db.query('SELECT * FROM iniciativa_historica WHERE plan_id = $1', [planId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron iniciativas para este plan' });
        }

        const iniciativas = result.rows.map(iniciativa => ({
            id: iniciativa.id,
            instrumento: iniciativa.instrumento,
            codigoInstrumento: iniciativa.codigo_instrumento,
            institucion: iniciativa.institucion,
            nombre: iniciativa.nombre,
            codigoBip: iniciativa.codigo_bip,
            plazo: iniciativa.plazo,
            montoTotal: iniciativa.monto_total,
            numAcuerdoCore: iniciativa.num_acuerdo_core,
            anio: iniciativa.anio,
            planId: iniciativa.plan_id
        }));

        res.json(iniciativas);
    } catch (error) {
        console.error('Error fetching iniciativas:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

routes.get('/iniciativa_prio/:planId', async (req, res) => {
    try{
        const db = await connectDb();
        const { planId } = req.params;
        const result = await db.query('SELECT * FROM iniciativa_priorizada WHERE plan_id = $1 and anio_priorizacion <= $2', [planId, new Date().getFullYear()]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron iniciativas para este plan' });
        }

        const iniciativas = result.rows.map(iniciativa => ({
            id: iniciativa.id,
            nombre: iniciativa.nombre,
            financiador: iniciativa.financiador,
            monto: iniciativa.monto,
            plazo: iniciativa.plazo_ejecucion,
            observaciones: iniciativa.observaciones,
            planId: iniciativa.plan_id
        }));

        res.json(iniciativas);
    } catch (error) {
        console.error('Error fetching iniciativas:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


export default routes;