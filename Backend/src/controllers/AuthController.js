// Backend/src/controllers/AuthController.js
import { config } from "../config.js";

const authController = {};

// Login simple con credenciales del .env
authController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar credenciales con las del .env
        const adminEmail = config.emailAdmin.email;
        const adminPassword = config.emailAdmin.password;

        if (email === adminEmail && password === adminPassword) {
            res.json({ 
                message: "Login exitoso",
                success: true,
                user: { email: adminEmail }
            });
        } else {
            res.status(401).json({ 
                message: "Credenciales incorrectas",
                success: false 
            });
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ 
            message: "Error interno del servidor",
            success: false 
        });
    }
};

export default authController;