import { apiClient } from "./client";
import { tokenStorage } from "./token-storage";
import type {
  LoginRequest,
  AuthResponse,
  RefreshTokenResponse,
  CheckStatusResponse,
  LogoutResponse,
  User,
} from "./types";

export const loginUser = async (
  credentials: LoginRequest,
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials,
  );

  await tokenStorage.setTokens(data.token, data.refreshToken);

  return data;
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const { data } = await apiClient.post<RefreshTokenResponse>("/auth/refresh", {
    refreshToken,
  });

  await tokenStorage.setAccessToken(data.token);

  return data.token;
};

export const checkAuthStatus = async (): Promise<User> => {
  const { data } =
    await apiClient.get<CheckStatusResponse>("/auth/check-token");
  return data.user;
};

export const logoutUser = async (
  refreshTokenOverride?: string,
): Promise<void> => {
  const refreshToken = await tokenStorage.getRefreshToken();

  await apiClient.post<LogoutResponse>("/auth/logout", {
    refreshToken: refreshTokenOverride || refreshToken,
  });

  await tokenStorage.clearTokens();
};
