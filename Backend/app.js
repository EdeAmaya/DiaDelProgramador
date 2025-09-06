import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import EquiposRoutes from "./src/routes/Equipos.js";
import JugadoresRoutes from "./src/routes/Jugadores.js";
import AuthRoutes from "./src/routes/Auth.js";

const app = express();

// Configuración de CORS
app.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rutas de la aplicación
app.use("/api/equipos", EquiposRoutes);
app.use("/api/jugadores", JugadoresRoutes);
app.use("/api/auth", AuthRoutes);

// Middleware de manejo de errores
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'production' ? {} : error.message 
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

export default app;