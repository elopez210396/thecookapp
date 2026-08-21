import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.js';
import type { JwtPayload, Rol } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const token = header.slice('Bearer '.length);
    req.usuario = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

export function requireRol(...roles: Rol[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ message: 'No tienes permiso para esta acción' });
    }
    next();
  };
}
