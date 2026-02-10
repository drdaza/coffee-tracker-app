import { apiClient } from "../client";
import type { User } from "../types";

export const userService = {
  async getMyProfile(): Promise<User> {
    const response = await apiClient.get<User>("/users/my-profile");
    return response.data;
  },
};
