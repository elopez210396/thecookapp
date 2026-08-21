import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ROLES_HOME } from './utils/constants';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CocinePage from './pages/CocinePage';
import DomiciliarioPage from './pages/DomiciliarioPage';
import ClientesPage from './pages/ClientesPage';

export default function App() {
  const usuario = useAuthStore((s) => s.usuario);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ClientesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cocina"
        element={
          <ProtectedRoute allowedRoles={['Cocina']}>
            <CocinePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/domiciliario"
        element={
          <ProtectedRoute allowedRoles={['Domiciliario']}>
            <DomiciliarioPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to={usuario ? ROLES_HOME[usuario.rol] || '/login' : '/login'} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
