import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";
import { tokenStorage } from "./token-storage";
import { AppError, type ApiErrorResponse } from "./errors";
import { authEvents, AUTH_EVENTS } from "@/utils/authEvents";

const getApiUrl = (): string => {
  if (!__DEV__) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const platformUrls: Record<string, string> = {
    android: process.env.EXPO_PUBLIC_API_URL_ANDROID,
    ios: process.env.EXPO_PUBLIC_API_URL_IOS,
  };

  return platformUrls[Platform.OS] || process.env.EXPO_PUBLIC_API_URL;
};

const API_BASE_URL = getApiUrl();
const API_TIMEOUT = 10000;

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Create and configure axios instance
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await tokenStorage.getAccessToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 - Token expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Wait for the token refresh to complete
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await tokenStorage.getRefreshToken();

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // Refresh the access token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const newAccessToken = response.data.token;
          await tokenStorage.setAccessToken(newAccessToken);

          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error, null);
          isRefreshing = false;

          await tokenStorage.clearTokens();
          authEvents.emit(AUTH_EVENTS.REVOKED);

          throw new AppError("Session expired", 401);
        }
      }

      // Transform axios error to AppError
      if (error.response) {
        const errorData = error.response.data as ApiErrorResponse;
        const message = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message || error.message;

        throw new AppError(message, error.response.status, errorData);
      } else if (error.request) {
        throw new AppError("Network error - no response from server", 0);
      } else {
        throw new AppError(error.message, 0);
      }
    },
  );

  return client;
}

/**
 * Export configured axios instance
 */
export const apiClient = createApiClient();
