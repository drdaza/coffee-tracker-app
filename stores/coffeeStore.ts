import { create } from "zustand";
import { coffeeService } from "@/api/coffee/service";
import type { Coffee, CreateCoffeeDto, UpdateCoffeeDto } from "@/api/coffee";

interface CoffeeStore {
  // State
  coffees: Coffee[];
  myCollection: Coffee[];
  myCreations: Coffee[];
  coffeeDetail: Coffee | null;
  isLoading: boolean;

  // Actions - Coffee CRUD
  fetchCoffees: () => Promise<void>;
  fetchCoffee: (id: string) => Promise<void>;
  createCoffee: (data: CreateCoffeeDto) => Promise<Coffee>;
  updateCoffee: (id: string, data: UpdateCoffeeDto) => Promise<Coffee>;
  deleteCoffee: (id: string) => Promise<void>;

  // Actions - Collection Management
  addToCollection: (coffeeId: string) => Promise<void>;
  removeFromCollection: (coffeeId: string) => Promise<void>;
  fetchMyCollection: () => Promise<void>;
  fetchMyCreations: () => Promise<void>;

  // Utility
  setCoffeeDetail: (coffee: Coffee | null) => void;
}

export const useCoffeeStore = create<CoffeeStore>((set, get) => {
  // Helper function to handle async operations with loading state
  const withLoading = async <T>(operation: () => Promise<T>): Promise<T> => {
    set({ isLoading: true });
    try {
      const result = await operation();
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw error; // Let UI handle error display
    }
  };

  return {
    // Initial State
    coffees: [],
    myCollection: [],
    myCreations: [],
    coffeeDetail: null,
    isLoading: false,

    // Coffee CRUD Actions
    fetchCoffees: () =>
      withLoading(async () => {
        const coffees = await coffeeService.getCoffees();
        set({ coffees });
      }),

    fetchCoffee: (id: string) =>
      withLoading(async () => {
        const coffee = await coffeeService.getCoffee(id);
        set({ coffeeDetail: coffee });
      }),

    createCoffee: (data: CreateCoffeeDto) =>
      withLoading(async () => {
        const newCoffee = await coffeeService.createCoffee(data);
        set((state) => ({
          coffees: [newCoffee, ...state.coffees],
          myCreations: [newCoffee, ...state.myCreations],
        }));
        return newCoffee;
      }),

    updateCoffee: (id: string, data: UpdateCoffeeDto) =>
      withLoading(async () => {
        const updatedCoffee = await coffeeService.updateCoffee(id, data);
        set((state) => ({
          coffees: state.coffees.map((c) => (c.id === id ? updatedCoffee : c)),
          myCreations: state.myCreations.map((c) =>
            c.id === id ? updatedCoffee : c,
          ),
          coffeeDetail:
            state.coffeeDetail?.id === id ? updatedCoffee : state.coffeeDetail,
        }));
        return updatedCoffee;
      }),

    deleteCoffee: (id: string) =>
      withLoading(async () => {
        await coffeeService.deleteCoffee(id);
        set((state) => ({
          coffees: state.coffees.filter((c) => c.id !== id),
          myCreations: state.myCreations.filter((c) => c.id !== id),
          myCollection: state.myCollection.filter((c) => c.id !== id),
          coffeeDetail:
            state.coffeeDetail?.id === id ? null : state.coffeeDetail,
        }));
      }),

    // Collection Management Actions
    addToCollection: (coffeeId: string) =>
      withLoading(async () => {
        await coffeeService.addToCollection(coffeeId);
        await get().fetchMyCollection();
      }),

    removeFromCollection: (coffeeId: string) =>
      withLoading(async () => {
        await coffeeService.removeFromCollection(coffeeId);
        set((state) => ({
          myCollection: state.myCollection.filter((c) => c.id !== coffeeId),
        }));
      }),

    fetchMyCollection: () =>
      withLoading(async () => {
        const collection = await coffeeService.getMyCollection();
        set({ myCollection: collection });
      }),

    fetchMyCreations: () =>
      withLoading(async () => {
        const creations = await coffeeService.getMyCreations();
        set({ myCreations: creations });
      }),

    // Utility Actions
    setCoffeeDetail: (coffee: Coffee | null) => set({ coffeeDetail: coffee }),
  };
});
