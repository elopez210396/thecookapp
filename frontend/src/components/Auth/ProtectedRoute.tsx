import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { Rol } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Rol[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const usuario = useAuthStore((s) => s.usuario);

  if (!usuario) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(usuario.rol)) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
