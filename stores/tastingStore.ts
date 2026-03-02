import { create } from "zustand";
import { tastingService } from "@/api/tasting/service";
import { authEvents, AUTH_EVENTS } from "@/utils/authEvents";
import type {
  Tasting,
  CreateTastingDto,
  UpdateTastingDto,
} from "@/api/tasting";

interface TastingStore {
  // State
  coffeeTastings: Tasting[];
  tastingDetail: Tasting | null;
  isLoading: boolean;

  // Actions - Tasting CRUD
  fetchCoffeeTastings: (coffeeId: string) => Promise<void>;
  fetchTasting: (id: string) => Promise<void>;
  createTasting: (coffeeId: string, data: CreateTastingDto) => Promise<Tasting>;
  updateTasting: (id: string, data: UpdateTastingDto) => Promise<Tasting>;
  deleteTasting: (id: string) => Promise<void>;

  // Utility
  setTastingDetail: (tasting: Tasting | null) => void;
  clearCoffeeTastings: () => void;
}

export const useTastingStore = create<TastingStore>((set) => {
  const withLoading = async <T>(operation: () => Promise<T>): Promise<T> => {
    set({ isLoading: true });
    try {
      const result = await operation();
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  };

  return {
    // Initial State
    coffeeTastings: [],
    tastingDetail: null,
    isLoading: false,

    // Tasting Actions
    fetchCoffeeTastings: (coffeeId: string) =>
      withLoading(async () => {
        const tastings = await tastingService.getCoffeeTastings(coffeeId);
        set({ coffeeTastings: tastings });
      }),

    fetchTasting: (id: string) =>
      withLoading(async () => {
        const tasting = await tastingService.getTasting(id);
        set({ tastingDetail: tasting });
      }),

    createTasting: (coffeeId: string, data: CreateTastingDto) =>
      withLoading(async () => {
        const newTasting = await tastingService.createTasting(coffeeId, data);
        set((state) => ({
          coffeeTastings: [newTasting, ...state.coffeeTastings],
        }));
        return newTasting;
      }),

    updateTasting: (id: string, data: UpdateTastingDto) =>
      withLoading(async () => {
        const updated = await tastingService.updateTasting(id, data);
        set((state) => ({
          coffeeTastings: state.coffeeTastings.map((t) =>
            t.id === id ? updated : t,
          ),
          tastingDetail:
            state.tastingDetail?.id === id ? updated : state.tastingDetail,
        }));
        return updated;
      }),

    deleteTasting: (id: string) =>
      withLoading(async () => {
        await tastingService.deleteTasting(id);
        set((state) => ({
          coffeeTastings: state.coffeeTastings.filter((t) => t.id !== id),
          tastingDetail:
            state.tastingDetail?.id === id ? null : state.tastingDetail,
        }));
      }),

    // Utility Actions
    setTastingDetail: (tasting: Tasting | null) =>
      set({ tastingDetail: tasting }),
    clearCoffeeTastings: () => set({ coffeeTastings: [], tastingDetail: null }),
  };
});

// Clear all tasting data on auth revocation (logout / token expiry)
authEvents.on(AUTH_EVENTS.REVOKED, () => {
  useTastingStore.setState({
    coffeeTastings: [],
    tastingDetail: null,
    isLoading: false,
  });
});
