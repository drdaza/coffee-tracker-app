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

// Coffee entity
export interface Coffee {
  id: string;
  name: string;
  roaster: string;
  origin: string;
  roastLevel: RoastLevel;
  brewingMethod: BrewingMethod;
  process: string | null;
  price: number; // in cents
  description?: string;
  image?: string;
  rate?: number;
  createdAt: string;
  updatedAt: string;
  creator: CoffeeCreator;
  isCreator: boolean;
  stats: CoffeeStats;
}

// Coffee DTOs
export interface CreateCoffeeDto {
  name: string;
  roaster: string;
  origin: string;
  roastLevel: RoastLevel;
  brewingMethod: BrewingMethod;
  process?: string;
  price: number; // in cents
  notes?: string;
}

export interface UpdateCoffeeDto {
  name?: string;
  roaster?: string;
  origin?: string;
  roastLevel?: RoastLevel;
  brewingMethod?: BrewingMethod;
  process?: string;
  price?: number; // in cents
  notes?: string;
}

// API Response types
export interface CoffeesResponse {
  data: Coffee[];
  total: number;
}

export interface CoffeeResponse {
  data: Coffee;
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
