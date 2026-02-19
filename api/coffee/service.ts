import { apiClient } from "../client";
import type {
  Coffee,
  CoffeeQueryParams,
  CreateCoffeeDto,
  UpdateCoffeeDto,
  CoffeesResponse,
} from "./types";

export const coffeeService = {
  /**
   * Get paginated coffees with optional search, filter, sort
   */
  async getCoffees(params?: CoffeeQueryParams): Promise<CoffeesResponse> {
    const response = await apiClient.get<CoffeesResponse>("/coffees", {
      params,
    });
    return response.data;
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
   * Get user's coffee collection with optional search, filter, sort, pagination
   */
  async getMyCollection(params?: CoffeeQueryParams): Promise<CoffeesResponse> {
    const response = await apiClient.get<CoffeesResponse>(
      "/coffees/my-collection",
      { params },
    );
    return response.data;
  },

  /**
   * Get coffees created by the current user with optional search, filter, sort, pagination
   */
  async getMyCreations(params?: CoffeeQueryParams): Promise<CoffeesResponse> {
    const response = await apiClient.get<CoffeesResponse>(
      "/coffees/my-creations",
      { params },
    );
    return response.data;
  },
};
