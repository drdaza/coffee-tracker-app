import { BrewingMethod, RoastLevel } from "./enums";

// Coffee creator info
export interface CoffeeCreator {
  id: string;
  name: string;
  email: string;
}

// Coffee stats
export interface CoffeeStats {
  totalInCollections: number;
  totalTastings: number;
}

// Pagination meta from API
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Coffee entity (matches API response)
export interface Coffee {
  id: string;
  name: string;
  roaster: string;
  origin: string;
  roastLevel: RoastLevel;
  brewingMethod: BrewingMethod;
  process: string | null;
  price: number; // in cents
  description: string | null;
  image: string | null;
  rate: number | null; // 1-5 rating
  createdAt: string;
  updatedAt: string;
  creator: CoffeeCreator;
  isCreator: boolean;
  stats: CoffeeStats;
}

// Coffee DTOs - matches API CreateCoffeeDto
export interface CreateCoffeeDto {
  name: string;
  roaster: string;
  origin: string;
  roastLevel: RoastLevel;
  brewingMethod: BrewingMethod;
  price: number; // in cents
  process?: string;
  description?: string;
  rate?: number; // 1-5 rating
  // image?: string; // Skipped for now - OCR feature post-MVP
}

// Coffee DTOs - matches API UpdateCoffeeDto (partial)
export interface UpdateCoffeeDto {
  name?: string;
  roaster?: string;
  origin?: string;
  roastLevel?: RoastLevel;
  brewingMethod?: BrewingMethod;
  price?: number; // in cents
  process?: string;
  description?: string;
  rate?: number; // 1-5 rating
  // image?: string; // Skipped for now - OCR feature post-MVP
}

// API Response types
export interface CoffeesResponse {
  data: Coffee[];
  meta: PaginationMeta;
}

// Collection DTOs
export interface AddToCollectionDto {
  coffeeId: string;
}

export interface RemoveFromCollectionDto {
  coffeeId: string;
}

export interface CollectionResponse {
  data: Coffee[];
}
