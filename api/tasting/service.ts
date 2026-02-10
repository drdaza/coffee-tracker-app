import { apiClient } from "../client";
import type {
  Tasting,
  CreateTastingDto,
  UpdateTastingDto,
  TastingsResponse,
} from "./types";

export const tastingService = {
  async getTastings(): Promise<Tasting[]> {
    const response = await apiClient.get<TastingsResponse>("/tasting");
    return response.data.data;
  },

  async getTasting(id: string): Promise<Tasting> {
    const response = await apiClient.get<Tasting>(`/tasting/${id}`);
    return response.data;
  },

  async createTasting(
    coffeeId: string,
    data: CreateTastingDto,
  ): Promise<Tasting> {
    const response = await apiClient.post<Tasting>(
      `/tasting/${coffeeId}`,
      data,
    );
    return response.data;
  },

  async updateTasting(id: string, data: UpdateTastingDto): Promise<Tasting> {
    const response = await apiClient.patch<Tasting>(`/tasting/${id}`, data);
    return response.data;
  },

  async deleteTasting(id: string): Promise<void> {
    await apiClient.delete(`/tasting/${id}`);
  },

  async getCoffeeTastings(coffeeId: string): Promise<Tasting[]> {
    const response = await apiClient.get<TastingsResponse>("/tasting", {
      params: { coffeeId },
    });
    return response.data.data;
  },
};
