import { apiClient } from "../client";
import type {
  Coffee,
  CreateCoffeeDto,
  UpdateCoffeeDto,
  CoffeesResponse,
  CollectionResponse,
} from "./types";

export const coffeeService = {
  /**
   * Get all coffees
   */
  async getCoffees(): Promise<Coffee[]> {
    const response = await apiClient.get<CoffeesResponse>("/coffees");
    return response.data.data;
  },

  /**
   * Get a single coffee by ID
   */
  async getCoffee(id: string): Promise<Coffee> {
    const response = await apiClient.get<Coffee>(`/coffees/${id}`);
    return response.data;
  },

  /**
   * Create a new coffee
   */
  async createCoffee(data: CreateCoffeeDto): Promise<Coffee> {
    const response = await apiClient.post<Coffee>("/coffees", data);
    return response.data;
  },

  /**
   * Update an existing coffee
   */
  async updateCoffee(id: string, data: UpdateCoffeeDto): Promise<Coffee> {
    const response = await apiClient.patch<Coffee>(`/coffees/${id}`, data);
    return response.data;
  },

  /**
   * Delete a coffee
   */
  async deleteCoffee(id: string): Promise<void> {
    await apiClient.delete(`/coffees/${id}`);
  },

  /**
   * Add a coffee to user's collection
   */
  async addToCollection(coffeeId: string): Promise<void> {
    await apiClient.post(`/coffees/${coffeeId}/add-to-collection`);
  },

  /**
   * Remove a coffee from user's collection
   */
  async removeFromCollection(coffeeId: string): Promise<void> {
    await apiClient.delete(`/coffees/${coffeeId}/remove-from-collection`);
  },

  /**
   * Get user's coffee collection
   */
  async getMyCollection(): Promise<Coffee[]> {
    const response = await apiClient.get<CollectionResponse>(
      "/coffees/my-collection",
    );
    return response.data.data;
  },

  /**
   * Get coffees created by the current user
   */
  async getMyCreations(): Promise<Coffee[]> {
    const response = await apiClient.get<CoffeesResponse>(
      "/coffees/my-creations",
    );
    return response.data.data;
  },
};
