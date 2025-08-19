import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './src/routes/index.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://observa2037.netlify.app'
];
app.use(cors({
  origin: function(origin, callback) {
    // Permitir solicitudes sin origin (como Postman) o si el origin está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(morgan('dev'));
app.use(express.json());

app.use(router);

export default app;