import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateCredentials, generateToken } from '../services/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const usuario = await validateCredentials(email, password);
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = generateToken(usuario);
    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

export default router;
