import { useState, useCallback } from "react";
import { loginUser, logoutUser, checkAuthStatus } from "@/api/auth";
import { AppError } from "@/api/errors";
import type { User, LoginRequest } from "@/api/types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser(credentials);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof AppError ? err.getUserMessage() : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      const errorMessage =
        err instanceof AppError ? err.getUserMessage() : "Logout failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await checkAuthStatus();
      setUser(userData);
      return userData;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    checkStatus,
  };
};
