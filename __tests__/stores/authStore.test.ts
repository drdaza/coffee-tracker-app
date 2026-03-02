import { useAuthStore } from "@/stores/authStore";
import { AuthStatus } from "@/constants/authStatus";
import { AppError } from "@/api/errors";
import { authEvents, AUTH_EVENTS } from "@/utils/authEvents";

// Mock dependencies
jest.mock("@/api/auth", () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  logoutUser: jest.fn(),
  checkAuthStatus: jest.fn(),
}));

jest.mock("@/api/token-storage", () => ({
  tokenStorage: {
    hasTokens: jest.fn(),
    clearTokens: jest.fn(),
    setTokens: jest.fn(),
  },
}));

import {
  loginUser,
  registerUser,
  logoutUser,
  checkAuthStatus,
} from "@/api/auth";
import { tokenStorage } from "@/api/token-storage";

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
const mockRegisterUser = registerUser as jest.MockedFunction<
  typeof registerUser
>;
const mockLogoutUser = logoutUser as jest.MockedFunction<typeof logoutUser>;
const mockCheckAuthStatus = checkAuthStatus as jest.MockedFunction<
  typeof checkAuthStatus
>;
const mockTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;

const mockUser = {
  id: "1",
  name: "Test User",
  email: "test@test.com",
  role: "USER" as const,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

const mockAuthResponse = {
  user: { id: "1", name: "Test User", email: "test@test.com", role: "USER" as const },
  token: "access-token",
  refreshToken: "refresh-token",
};

describe("authStore", () => {
  beforeEach(() => {
    // Reset store to initial state
    useAuthStore.setState({
      authStatus: AuthStatus.CHECKING,
      user: null,
      error: null,
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("starts with CHECKING status", () => {
      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.CHECKING);
    });

    it("starts with null user", () => {
      expect(useAuthStore.getState().user).toBeNull();
    });

    it("starts with no error and not loading", () => {
      expect(useAuthStore.getState().error).toBeNull();
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe("setAuthStatus", () => {
    it("updates auth status", () => {
      useAuthStore.getState().setAuthStatus(AuthStatus.LOGGED_IN);
      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_IN);
    });
  });

  describe("initializeAuth", () => {
    it("sets LOGGED_OUT when no tokens exist", async () => {
      mockTokenStorage.hasTokens.mockResolvedValue(false);

      await useAuthStore.getState().initializeAuth();

      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_OUT);
      expect(mockCheckAuthStatus).not.toHaveBeenCalled();
    });

    it("sets LOGGED_IN and hydrates user when tokens exist and are valid", async () => {
      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockCheckAuthStatus.mockResolvedValue(mockUser);

      await useAuthStore.getState().initializeAuth();

      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_IN);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it("clears tokens and sets LOGGED_OUT when token check fails", async () => {
      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockCheckAuthStatus.mockRejectedValue(new Error("Token expired"));

      await useAuthStore.getState().initializeAuth();

      expect(mockTokenStorage.clearTokens).toHaveBeenCalled();
      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_OUT);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe("login", () => {
    it("sets LOGGED_IN and user on success", async () => {
      mockLoginUser.mockResolvedValue(mockAuthResponse);

      await useAuthStore.getState().login("test@test.com", "password");

      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_IN);
      expect(useAuthStore.getState().user).toEqual(mockAuthResponse.user);
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().error).toBeNull();
    });

    it("sets loading state during login", async () => {
      let resolveLogin: (value: typeof mockAuthResponse) => void;
      mockLoginUser.mockImplementation(
        () => new Promise((resolve) => { resolveLogin = resolve; }),
      );

      const promise = useAuthStore.getState().login("test@test.com", "password");
      expect(useAuthStore.getState().isLoading).toBe(true);

      resolveLogin!(mockAuthResponse);
      await promise;
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("sets error and LOGGED_OUT on AppError failure", async () => {
      const appError = new AppError("Invalid credentials", 401);
      mockLoginUser.mockRejectedValue(appError);

      await expect(
        useAuthStore.getState().login("test@test.com", "wrong"),
      ).rejects.toThrow();

      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_OUT);
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().error).toBe(appError.getUserMessage());
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("sets generic error message for non-AppError failures", async () => {
      mockLoginUser.mockRejectedValue(new Error("Network error"));

      await expect(
        useAuthStore.getState().login("test@test.com", "password"),
      ).rejects.toThrow();

      expect(useAuthStore.getState().error).toBe("Login failed");
    });
  });

  describe("register", () => {
    it("sets LOGGED_IN and user on success", async () => {
      mockRegisterUser.mockResolvedValue(mockAuthResponse);

      await useAuthStore.getState().register("Test", "test@test.com", "password");

      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_IN);
      expect(useAuthStore.getState().user).toEqual(mockAuthResponse.user);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("sets error on failure but does not change authStatus", async () => {
      const appError = new AppError("Email taken", 409);
      mockRegisterUser.mockRejectedValue(appError);

      // Set initial status
      useAuthStore.setState({ authStatus: AuthStatus.CHECKING });

      await expect(
        useAuthStore.getState().register("Test", "test@test.com", "password"),
      ).rejects.toThrow();

      // Register failure does NOT set LOGGED_OUT (unlike login)
      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.CHECKING);
      expect(useAuthStore.getState().error).toBe(appError.getUserMessage());
    });

    it("sets generic error message for non-AppError", async () => {
      mockRegisterUser.mockRejectedValue(new Error("Network error"));

      await expect(
        useAuthStore.getState().register("Test", "test@test.com", "password"),
      ).rejects.toThrow();

      expect(useAuthStore.getState().error).toBe("Registration failed");
    });
  });

  describe("logout", () => {
    it("emits REVOKED event and sets LOGGED_OUT on success", async () => {
      mockLogoutUser.mockResolvedValue(undefined);
      const emitSpy = jest.spyOn(authEvents, "emit");

      useAuthStore.setState({
        authStatus: AuthStatus.LOGGED_IN,
        user: mockUser,
      });

      await useAuthStore.getState().logout();

      expect(emitSpy).toHaveBeenCalledWith(AUTH_EVENTS.REVOKED);
      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_OUT);
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isLoading).toBe(false);

      emitSpy.mockRestore();
    });

    it("sets error on failure and re-throws", async () => {
      const appError = new AppError("Server error", 500);
      mockLogoutUser.mockRejectedValue(appError);

      useAuthStore.setState({
        authStatus: AuthStatus.LOGGED_IN,
        user: mockUser,
      });

      await expect(useAuthStore.getState().logout()).rejects.toThrow();

      expect(useAuthStore.getState().error).toBe(appError.getUserMessage());
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe("checkStatus", () => {
    it("updates user and sets LOGGED_IN on success", async () => {
      mockCheckAuthStatus.mockResolvedValue(mockUser);

      await useAuthStore.getState().checkStatus();

      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_IN);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it("sets LOGGED_OUT on failure without setting error", async () => {
      mockCheckAuthStatus.mockRejectedValue(new Error("Unauthorized"));

      await useAuthStore.getState().checkStatus();

      expect(useAuthStore.getState().authStatus).toBe(AuthStatus.LOGGED_OUT);
      expect(useAuthStore.getState().user).toBeNull();
      // checkStatus swallows the error
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe("auth revocation listener", () => {
    it("resets store state when auth:revoked event is emitted", () => {
      // Set logged-in state
      useAuthStore.setState({
        authStatus: AuthStatus.LOGGED_IN,
        user: mockUser,
        error: "some error",
        isLoading: true,
      });

      authEvents.emit(AUTH_EVENTS.REVOKED);

      const state = useAuthStore.getState();
      expect(state.authStatus).toBe(AuthStatus.LOGGED_OUT);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });
});
