import { AuthStatus } from '@/constants/authStatus';
import { create } from 'zustand';
import { loginUser, logoutUser, checkAuthStatus } from '@/api/auth';
import { tokenStorage } from '@/api/token-storage';
import { AppError } from '@/api/errors';
import { authEvents, AUTH_EVENTS } from '@/utils/authEvents';
import type { User } from '@/api/types';

interface AuthStore {
  authStatus: AuthStatus;
  user: User | null;
  error: string | null;
  isLoading: boolean;
  setAuthStatus: (authStatus: AuthStatus) => void;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authStatus: AuthStatus.CHECKING,
  user: null,
  error: null,
  isLoading: false,

  setAuthStatus: (authStatus: AuthStatus) => set({ authStatus }),

  initializeAuth: async () => {
    const hasTokens = await tokenStorage.hasTokens();
    set({
      authStatus: hasTokens ? AuthStatus.LOGGED_IN : AuthStatus.LOGGED_OUT,
    });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginUser({ email, password });
      set({
        authStatus: AuthStatus.LOGGED_IN,
        user: response.user,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof AppError ? error.getUserMessage() : 'Login failed';
      set({
        authStatus: AuthStatus.LOGGED_OUT,
        user: null,
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logoutUser();
      set({
        authStatus: AuthStatus.LOGGED_OUT,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof AppError ? error.getUserMessage() : 'Logout failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  checkStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await checkAuthStatus();
      set({
        authStatus: AuthStatus.LOGGED_IN,
        user,
        isLoading: false,
      });
    } catch (error) {
      set({
        authStatus: AuthStatus.LOGGED_OUT,
        user: null,
        isLoading: false,
      });
    }
  },
}));

// Listen for auth revocation events (token expired/revoked)
authEvents.on(AUTH_EVENTS.REVOKED, () => {
  useAuthStore.setState({
    authStatus: AuthStatus.LOGGED_OUT,
    user: null,
    error: null,
    isLoading: false,
  });
});