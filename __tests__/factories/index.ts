import type { Coffee, CoffeesResponse, PaginationMeta } from "@/api/coffee";
import type { Tasting } from "@/api/tasting";
import type { User, AuthResponse } from "@/api/types";

export const makeCoffee = (overrides: Partial<Coffee> = {}): Coffee => ({
  id: "1",
  name: "Test Coffee",
  roaster: "Test Roaster",
  origin: "Colombia",
  roastLevel: "MEDIUM" as Coffee["roastLevel"],
  brewingMethod: "POUR_OVER" as Coffee["brewingMethod"],
  process: null,
  price: 2500,
  description: null,
  image: null,
  rate: null,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  creator: { id: "u1", name: "Creator", email: "c@test.com" },
  isCreator: false,
  isInCollection: false,
  hasTasted: false,
  stats: { totalInCollections: 0, totalTastings: 0 },
  ...overrides,
});

export const makeMeta = (
  overrides: Partial<PaginationMeta> = {},
): PaginationMeta => ({
  total: 10,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  ...overrides,
});

export const makeResponse = (
  data: Coffee[] = [],
  meta?: Partial<PaginationMeta>,
): CoffeesResponse => ({
  data,
  meta: makeMeta(meta),
});

export const makeTasting = (overrides: Partial<Tasting> = {}): Tasting => ({
  id: "t1",
  aroma: 7,
  flavor: 8,
  body: 6,
  acidity: 5,
  balance: 7,
  aftertaste: 6,
  overallScore: 6.5,
  notes: ["fruity", "smooth"],
  coffeeId: "c1",
  userId: "u1",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  ...overrides,
});

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "1",
  name: "Test User",
  email: "test@test.com",
  role: "USER" as const,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  ...overrides,
});

export const makeAuthResponse = (
  overrides: Partial<AuthResponse> = {},
): AuthResponse => ({
  user: {
    id: "1",
    name: "Test User",
    email: "test@test.com",
    role: "USER" as const,
  },
  token: "access-token",
  refreshToken: "refresh-token",
  ...overrides,
});
