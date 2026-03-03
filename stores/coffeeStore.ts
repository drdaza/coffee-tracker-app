import { create } from "zustand";
import { coffeeService } from "@/api/coffee/service";
import { authEvents, AUTH_EVENTS } from "@/utils/authEvents";
import { createWithLoading } from "@/utils/storeHelpers";
import type {
  Coffee,
  CoffeeQueryParams,
  CreateCoffeeDto,
  PaginationMeta,
  UpdateCoffeeDto,
} from "@/api/coffee";

interface CoffeeStore {
  // State
  coffees: Coffee[];
  coffeesMeta: PaginationMeta | null;
  myCollection: Coffee[];
  collectionMeta: PaginationMeta | null;
  myCreations: Coffee[];
  creationsMeta: PaginationMeta | null;
  coffeeDetail: Coffee | null;
  isLoading: boolean;
  isLoadingMore: boolean;

  // Actions - Coffee CRUD
  fetchCoffees: (params?: CoffeeQueryParams) => Promise<void>;
  loadMoreCoffees: (params?: CoffeeQueryParams) => Promise<void>;
  fetchCoffee: (id: string) => Promise<void>;
  createCoffee: (data: CreateCoffeeDto) => Promise<Coffee>;
  updateCoffee: (id: string, data: UpdateCoffeeDto) => Promise<Coffee>;
  deleteCoffee: (id: string) => Promise<void>;

  // Actions - Collection Management
  addToCollection: (coffeeId: string) => Promise<void>;
  removeFromCollection: (coffeeId: string) => Promise<void>;
  fetchMyCollection: (params?: CoffeeQueryParams) => Promise<void>;
  loadMoreCollection: (params?: CoffeeQueryParams) => Promise<void>;
  fetchMyCreations: (params?: CoffeeQueryParams) => Promise<void>;
  loadMoreCreations: (params?: CoffeeQueryParams) => Promise<void>;

  // Utility
  setCoffeeDetail: (coffee: Coffee | null) => void;
}

export const useCoffeeStore = create<CoffeeStore>((set, get) => {
  const withLoading = createWithLoading(set);
  const withLoadingMore = createWithLoading(set, "isLoadingMore");

  return {
    // Initial State
    coffees: [],
    coffeesMeta: null,
    myCollection: [],
    collectionMeta: null,
    myCreations: [],
    creationsMeta: null,
    coffeeDetail: null,
    isLoading: false,
    isLoadingMore: false,

    // Coffee CRUD Actions
    fetchCoffees: (params?: CoffeeQueryParams) =>
      withLoading(async () => {
        const response = await coffeeService.getCoffees(params);
        set({ coffees: response.data, coffeesMeta: response.meta });
      }),

    loadMoreCoffees: (params?: CoffeeQueryParams) =>
      withLoadingMore(async () => {
        const { coffeesMeta } = get();
        if (!coffeesMeta?.hasNextPage) return;

        const nextPage = coffeesMeta.page + 1;
        const response = await coffeeService.getCoffees({
          ...params,
          page: nextPage,
        });
        set((state) => ({
          coffees: [...state.coffees, ...response.data],
          coffeesMeta: response.meta,
        }));
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
        set((state) => {
          const coffee =
            state.coffees.find((c) => c.id === coffeeId) ??
            (state.coffeeDetail?.id === coffeeId
              ? state.coffeeDetail
              : undefined);

          const updatedCoffees = state.coffees.map((c) =>
            c.id === coffeeId ? { ...c, isInCollection: true } : c,
          );
          const updatedDetail =
            state.coffeeDetail?.id === coffeeId
              ? { ...state.coffeeDetail, isInCollection: true }
              : state.coffeeDetail;
          const updatedCollection =
            coffee && !state.myCollection.some((c) => c.id === coffeeId)
              ? [...state.myCollection, { ...coffee, isInCollection: true }]
              : state.myCollection;

          return {
            coffees: updatedCoffees,
            coffeeDetail: updatedDetail,
            myCollection: updatedCollection,
          };
        });
      }),

    removeFromCollection: (coffeeId: string) =>
      withLoading(async () => {
        await coffeeService.removeFromCollection(coffeeId);
        set((state) => ({
          coffees: state.coffees.map((c) =>
            c.id === coffeeId ? { ...c, isInCollection: false } : c,
          ),
          coffeeDetail:
            state.coffeeDetail?.id === coffeeId
              ? { ...state.coffeeDetail, isInCollection: false }
              : state.coffeeDetail,
          myCollection: state.myCollection.filter((c) => c.id !== coffeeId),
        }));
      }),

    fetchMyCollection: (params?: CoffeeQueryParams) =>
      withLoading(async () => {
        const response = await coffeeService.getMyCollection(params);
        set({ myCollection: response.data, collectionMeta: response.meta });
      }),

    loadMoreCollection: (params?: CoffeeQueryParams) =>
      withLoadingMore(async () => {
        const { collectionMeta } = get();
        if (!collectionMeta?.hasNextPage) return;

        const nextPage = collectionMeta.page + 1;
        const response = await coffeeService.getMyCollection({
          ...params,
          page: nextPage,
        });
        set((state) => ({
          myCollection: [...state.myCollection, ...response.data],
          collectionMeta: response.meta,
        }));
      }),

    fetchMyCreations: (params?: CoffeeQueryParams) =>
      withLoading(async () => {
        const response = await coffeeService.getMyCreations(params);
        set({ myCreations: response.data, creationsMeta: response.meta });
      }),

    loadMoreCreations: (params?: CoffeeQueryParams) =>
      withLoadingMore(async () => {
        const { creationsMeta } = get();
        if (!creationsMeta?.hasNextPage) return;

        const nextPage = creationsMeta.page + 1;
        const response = await coffeeService.getMyCreations({
          ...params,
          page: nextPage,
        });
        set((state) => ({
          myCreations: [...state.myCreations, ...response.data],
          creationsMeta: response.meta,
        }));
      }),

    // Utility Actions
    setCoffeeDetail: (coffee: Coffee | null) => set({ coffeeDetail: coffee }),
  };
});

// Clear all coffee data on auth revocation (logout / token expiry)
authEvents.on(AUTH_EVENTS.REVOKED, () => {
  useCoffeeStore.setState({
    coffees: [],
    coffeesMeta: null,
    myCollection: [],
    collectionMeta: null,
    myCreations: [],
    creationsMeta: null,
    coffeeDetail: null,
    isLoading: false,
    isLoadingMore: false,
  });
});
