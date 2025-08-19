import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDb } from '../config/db.js';

const isTest = process.env.NODE_ENV === 'test';
let db;
// Registrar un nuevo usuario
export const register = async (req, res) => {
    const { email, password } = req.body;
    db = await connectDb();
    try {
        // Verificar si el usuario ya existe
        let user;
        const result = await db.query('SELECT * FROM usuario WHERE email = $1', [email]);
        user = result.rows[0];
    
        if (user) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar nuevo usuario
        
        await db.query(
            'INSERT INTO usuario (email, password) VALUES ($1, $2, $3)',
            [email, hashedPassword]
        );

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Login de usuario
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Establece la conexión a la base de datos si no se ha hecho
        if (!db) {
            db = await connectDb();
        }

        let user;

        if (isTest) {
            user = await db.get('SELECT * FROM usuario WHERE email = ?', [email]);
        } else {
            // Aquí va la lógica del login con la base de datos
            //const { email, password } = req.body;
            const result = await db.query('SELECT * FROM usuario WHERE email = $1', [email]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            user = result.rows[0];
        }

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Perfil del usuario autenticado
export const profile = async (req, res) => {
    const userId = req.user.id;

    try {
        let user;

        if (isTest) {
            user = await db.get('SELECT id, email, role FROM usuario WHERE id = ?', [userId]);
        } else {
            const result = await db.query('SELECT id, email, role FROM usuario WHERE id = $1', [userId]);
            user = result.rows[0];
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
