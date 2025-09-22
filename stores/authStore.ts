import { AuthStatus } from '@/constants/authStatus';
import { create } from 'zustand';



interface AuthStore {
  authStatus: AuthStatus;
  setauthStatus: (authStatus: AuthStatus) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
  register: (username: string, password: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authStatus: AuthStatus.LOGGED_OUT,
  setauthStatus: (authStatus: AuthStatus) => set({ authStatus }),
    login: (username: string, password: string) => set({ authStatus: AuthStatus.LOGGED_IN }),
  logout: () => set({ authStatus: AuthStatus.LOGGED_OUT }),
  register: (username: string, password: string) => set({ authStatus: AuthStatus.LOGGED_IN }),
}));