import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readSheet } from './sheets.js';
import type { Usuario, JwtPayload, Rol } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '365d';

export async function findUsuarioByEmail(email: string): Promise<Usuario | null> {
  const rows = await readSheet('Usuarios');
  const row = rows.find((r) => r.email.toLowerCase() === email.toLowerCase());
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    rol: row.rol as Rol,
    nombre: row.nombre,
  };
}

export async function validateCredentials(email: string, password: string): Promise<Usuario | null> {
  const usuario = await findUsuarioByEmail(email);
  if (!usuario) return null;

  const valido = await bcrypt.compare(password, usuario.passwordHash);
  if (!valido) return null;

  return usuario;
}

export function generateToken(usuario: Usuario): string {
  const payload: JwtPayload = {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
    nombre: usuario.nombre,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
