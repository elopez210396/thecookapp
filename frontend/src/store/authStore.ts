import { create } from 'zustand';
import * as authApi from '../api/auth';
import { LAST_EMAIL_KEY, TOKEN_KEY, USER_KEY } from '../utils/constants';
import type { AuthResponse } from '../types';

type Usuario = AuthResponse['usuario'];

interface AuthState {
  usuario: Usuario | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<Usuario>;
  logout: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { token, usuario } = await authApi.login(email, password);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));
      localStorage.setItem(LAST_EMAIL_KEY, email);
      set({ usuario, loading: false });
      return usuario;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Credenciales incorrectas';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ usuario: null });
  },

  restoreSession: () => {
    const raw = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (raw && token) {
      set({ usuario: JSON.parse(raw) });
    }
  },
}));
