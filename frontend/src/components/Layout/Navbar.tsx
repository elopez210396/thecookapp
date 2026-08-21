import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
      <span className="text-lg font-extrabold text-red-600">The Cook</span>
      <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-600">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">👤</span>
        <span className="hidden sm:inline">{usuario?.nombre}</span>
      </button>
    </header>
  );
}
