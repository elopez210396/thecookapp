import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROLES_HOME } from '../../utils/constants';
import Button from '../common/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError('Completa email y contraseña');
      return;
    }

    try {
      const usuario = await login(email.trim(), password);
      navigate(ROLES_HOME[usuario.rol] || '/');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
          autoComplete="username"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
          autoComplete="current-password"
        />
      </div>

      {localError && <p className="text-sm text-red-600">{localError}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Ingresando...' : 'INGRESAR'}
      </Button>
    </form>
  );
}
