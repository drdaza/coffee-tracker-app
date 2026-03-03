import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

let cachedAccessToken: string | null = null;

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    if (cachedAccessToken !== null) {
      return cachedAccessToken;
    }
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    cachedAccessToken = token;
    return token;
  },

  async setAccessToken(token: string): Promise<void> {
    cachedAccessToken = token;
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    cachedAccessToken = accessToken;
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    cachedAccessToken = null;
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },

  async hasTokens(): Promise<boolean> {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);
    return !!(accessToken && refreshToken);
  },
};
