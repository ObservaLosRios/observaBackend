import express from 'express';
import soap from 'soap';
import axios from 'axios';

const routes = express.Router();

// Configuración básica
const user = process.env.BC_USER;
const pass = process.env.BC_PASSWORD;
const frequencyCode = process.env.BC_FREQUENCY_CODE;
const wsdl = process.env.BC_WSDL;
const asx = process.env.BC_ASX;

routes.get('/series', async (req, res) => {
    try {
        const client = await soap.createClientAsync(wsdl);
        const params = { user, password, frequencyCode };

        const [response] = await client.SearchSeriesAsync(params);
        const result = response.SearchSeriesResult;

        const seriesList = result.SeriesInfos.internetSeriesInfo;
        const seriesArray = Array.isArray(seriesList) ? seriesList : [seriesList];

        const formatted = seriesArray.map(serie => ({
            seriesId: serie.seriesId,
            spanishTitle: serie.spanishTitle
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error al obtener series:', error);
        res.status(500).send('Error al obtener series');
    }
});

routes.get('/series/data', async (req, res) => {
    const { seriesId, firstDate, lastDate } = req.query;

    if (!seriesId || !firstDate || !lastDate) {
        return res.status(400).json({ error: 'Parámetros requeridos: seriesId, firstDate, lastDate' });
    }
    const lasSeries = Array.isArray(seriesId) ? seriesId : [seriesId];
    const qs = new URLSearchParams({
        user,
        pass,
        firstDate,
        lastDate
    });
    // timeseries es un array: añádelo repetidamente
    lasSeries.forEach(serie => qs.append('timeseries', serie));

    // Muestra la URL final
    const finalUrl = `${asx}?${qs.toString()}`;
    console.log('URL final:', finalUrl);

    try {
        // const { data } = await axios.get(finalUrl, {
        //     params: {
        //         user,
        //         pass,
        //         firstDate,
        //         lastDate,
        //         timeseries: lasSeries
        //     }
        // });
        const { data } = await axios.get(finalUrl);
        console.log('GET response:', data);


        res.json(data);
    } catch (error) {
        console.error('Error en /series/data:', error);
        res.status(500).json({ error: 'Error al obtener datos de series' });
    }
});

export default routes;