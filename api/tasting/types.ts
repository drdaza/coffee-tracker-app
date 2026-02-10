// Tasting entity (matches API TastingResponseDto)
export interface Tasting {
  id: string;
  aroma: number; // 0-10
  flavor: number; // 0-10
  body: number; // 0-10
  acidity: number; // 0-10
  balance: number; // 0-10
  aftertaste: number; // 0-10
  overallScore: number; // backend-calculated average
  notes: string[];
  coffeeId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Create DTO - coffeeId is a PATH param, not in body
export interface CreateTastingDto {
  aroma?: number;
  flavor?: number;
  body?: number;
  acidity?: number;
  balance?: number;
  aftertaste?: number;
  notes?: string[];
}

// Update DTO - partial
export interface UpdateTastingDto {
  aroma?: number;
  flavor?: number;
  body?: number;
  acidity?: number;
  balance?: number;
  aftertaste?: number;
  notes?: string[];
}

// API response types
export interface TastingsResponse {
  data: Tasting[];
}
