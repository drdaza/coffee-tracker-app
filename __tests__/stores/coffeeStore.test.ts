import { useCoffeeStore } from "@/stores/coffeeStore";
import { authEvents, AUTH_EVENTS } from "@/utils/authEvents";
import type { Coffee, CoffeesResponse, PaginationMeta } from "@/api/coffee";

// Mock the coffee service
jest.mock("@/api/coffee/service", () => ({
  coffeeService: {
    getCoffees: jest.fn(),
    getCoffee: jest.fn(),
    createCoffee: jest.fn(),
    updateCoffee: jest.fn(),
    deleteCoffee: jest.fn(),
    addToCollection: jest.fn(),
    removeFromCollection: jest.fn(),
    getMyCollection: jest.fn(),
    getMyCreations: jest.fn(),
  },
}));

// Mock authEvents to prevent side effects from other store modules
jest.mock("@/utils/authEvents", () => {
  const listeners = new Map<string, Set<() => void>>();
  return {
    AUTH_EVENTS: {
      REVOKED: "auth:revoked",
      REFRESHED: "auth:refreshed",
    },
    authEvents: {
      on: jest.fn((event: string, listener: () => void) => {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event)!.add(listener);
      }),
      off: jest.fn((event: string, listener: () => void) => {
        listeners.get(event)?.delete(listener);
      }),
      emit: jest.fn((event: string) => {
        listeners.get(event)?.forEach((l) => l());
      }),
    },
  };
});

import { coffeeService } from "@/api/coffee/service";

const mockService = coffeeService as jest.Mocked<typeof coffeeService>;

const makeCoffee = (overrides: Partial<Coffee> = {}): Coffee => ({
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

const makeMeta = (overrides: Partial<PaginationMeta> = {}): PaginationMeta => ({
  total: 10,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  ...overrides,
});

const makeResponse = (
  data: Coffee[] = [],
  meta?: Partial<PaginationMeta>,
): CoffeesResponse => ({
  data,
  meta: makeMeta(meta),
});

const initialState = {
  coffees: [],
  coffeesMeta: null,
  myCollection: [],
  collectionMeta: null,
  myCreations: [],
  creationsMeta: null,
  coffeeDetail: null,
  isLoading: false,
  isLoadingMore: false,
};

describe("coffeeStore", () => {
  beforeEach(() => {
    useCoffeeStore.setState(initialState);
    jest.clearAllMocks();
  });

  describe("fetchCoffees", () => {
    it("fetches and sets coffees with meta", async () => {
      const coffees = [makeCoffee({ id: "1" }), makeCoffee({ id: "2" })];
      mockService.getCoffees.mockResolvedValue(makeResponse(coffees));

      await useCoffeeStore.getState().fetchCoffees();

      expect(useCoffeeStore.getState().coffees).toEqual(coffees);
      expect(useCoffeeStore.getState().coffeesMeta).toBeTruthy();
    });

    it("passes query params to service", async () => {
      mockService.getCoffees.mockResolvedValue(makeResponse());
      const params = { search: "espresso", sortBy: "name" as const };

      await useCoffeeStore.getState().fetchCoffees(params);

      expect(mockService.getCoffees).toHaveBeenCalledWith(params);
    });

    it("manages isLoading state", async () => {
      let resolve: () => void;
      mockService.getCoffees.mockImplementation(
        () => new Promise((r) => { resolve = () => r(makeResponse()); }),
      );

      const promise = useCoffeeStore.getState().fetchCoffees();
      expect(useCoffeeStore.getState().isLoading).toBe(true);

      resolve!();
      await promise;
      expect(useCoffeeStore.getState().isLoading).toBe(false);
    });

    it("resets isLoading on error", async () => {
      mockService.getCoffees.mockRejectedValue(new Error("Network error"));

      await expect(useCoffeeStore.getState().fetchCoffees()).rejects.toThrow();
      expect(useCoffeeStore.getState().isLoading).toBe(false);
    });
  });

  describe("loadMoreCoffees", () => {
    it("appends new coffees to existing list", async () => {
      const existing = [makeCoffee({ id: "1" })];
      const next = [makeCoffee({ id: "2" })];
      useCoffeeStore.setState({
        coffees: existing,
        coffeesMeta: makeMeta({ page: 1, hasNextPage: true }),
      });
      mockService.getCoffees.mockResolvedValue(
        makeResponse(next, { page: 2, hasNextPage: false }),
      );

      await useCoffeeStore.getState().loadMoreCoffees();

      expect(useCoffeeStore.getState().coffees).toHaveLength(2);
      expect(useCoffeeStore.getState().coffees[1].id).toBe("2");
    });

    it("does not fetch when no next page", async () => {
      useCoffeeStore.setState({
        coffeesMeta: makeMeta({ hasNextPage: false }),
      });

      await useCoffeeStore.getState().loadMoreCoffees();

      expect(mockService.getCoffees).not.toHaveBeenCalled();
    });

    it("does not fetch when meta is null", async () => {
      useCoffeeStore.setState({ coffeesMeta: null });

      await useCoffeeStore.getState().loadMoreCoffees();

      expect(mockService.getCoffees).not.toHaveBeenCalled();
    });

    it("uses isLoadingMore flag instead of isLoading", async () => {
      useCoffeeStore.setState({
        coffeesMeta: makeMeta({ hasNextPage: true }),
      });

      let resolve: () => void;
      mockService.getCoffees.mockImplementation(
        () => new Promise((r) => { resolve = () => r(makeResponse()); }),
      );

      const promise = useCoffeeStore.getState().loadMoreCoffees();
      expect(useCoffeeStore.getState().isLoadingMore).toBe(true);
      expect(useCoffeeStore.getState().isLoading).toBe(false);

      resolve!();
      await promise;
      expect(useCoffeeStore.getState().isLoadingMore).toBe(false);
    });
  });

  describe("fetchCoffee", () => {
    it("fetches and sets coffee detail", async () => {
      const coffee = makeCoffee({ id: "123" });
      mockService.getCoffee.mockResolvedValue(coffee);

      await useCoffeeStore.getState().fetchCoffee("123");

      expect(useCoffeeStore.getState().coffeeDetail).toEqual(coffee);
    });
  });

  describe("createCoffee", () => {
    it("prepends new coffee to coffees and myCreations lists", async () => {
      const existing = [makeCoffee({ id: "1" })];
      useCoffeeStore.setState({ coffees: existing, myCreations: existing });

      const newCoffee = makeCoffee({ id: "2", name: "New" });
      mockService.createCoffee.mockResolvedValue(newCoffee);

      const result = await useCoffeeStore.getState().createCoffee({} as any);

      expect(result).toEqual(newCoffee);
      expect(useCoffeeStore.getState().coffees[0]).toEqual(newCoffee);
      expect(useCoffeeStore.getState().myCreations[0]).toEqual(newCoffee);
    });
  });

  describe("updateCoffee", () => {
    it("updates coffee in all lists and detail", async () => {
      const original = makeCoffee({ id: "1", name: "Old" });
      const updated = makeCoffee({ id: "1", name: "Updated" });

      useCoffeeStore.setState({
        coffees: [original],
        myCreations: [original],
        myCollection: [original],
        coffeeDetail: original,
      });
      mockService.updateCoffee.mockResolvedValue(updated);

      await useCoffeeStore.getState().updateCoffee("1", { name: "Updated" });

      const state = useCoffeeStore.getState();
      expect(state.coffees[0].name).toBe("Updated");
      expect(state.myCreations[0].name).toBe("Updated");
      expect(state.coffeeDetail?.name).toBe("Updated");
    });

    it("does not update coffeeDetail when viewing a different coffee", async () => {
      const coffee1 = makeCoffee({ id: "1", name: "Old" });
      const coffee2 = makeCoffee({ id: "2", name: "Other" });
      const updated1 = makeCoffee({ id: "1", name: "Updated" });

      useCoffeeStore.setState({
        coffees: [coffee1],
        myCreations: [],
        coffeeDetail: coffee2,
      });
      mockService.updateCoffee.mockResolvedValue(updated1);

      await useCoffeeStore.getState().updateCoffee("1", { name: "Updated" });

      expect(useCoffeeStore.getState().coffeeDetail?.id).toBe("2");
      expect(useCoffeeStore.getState().coffeeDetail?.name).toBe("Other");
    });
  });

  describe("deleteCoffee", () => {
    it("removes coffee from all lists and clears detail if matching", async () => {
      const coffee = makeCoffee({ id: "1" });
      useCoffeeStore.setState({
        coffees: [coffee],
        myCreations: [coffee],
        myCollection: [coffee],
        coffeeDetail: coffee,
      });
      mockService.deleteCoffee.mockResolvedValue(undefined);

      await useCoffeeStore.getState().deleteCoffee("1");

      const state = useCoffeeStore.getState();
      expect(state.coffees).toHaveLength(0);
      expect(state.myCreations).toHaveLength(0);
      expect(state.myCollection).toHaveLength(0);
      expect(state.coffeeDetail).toBeNull();
    });

    it("preserves coffeeDetail when deleting a different coffee", async () => {
      const coffee1 = makeCoffee({ id: "1" });
      const coffee2 = makeCoffee({ id: "2" });
      useCoffeeStore.setState({
        coffees: [coffee1, coffee2],
        myCreations: [],
        myCollection: [],
        coffeeDetail: coffee2,
      });
      mockService.deleteCoffee.mockResolvedValue(undefined);

      await useCoffeeStore.getState().deleteCoffee("1");

      expect(useCoffeeStore.getState().coffeeDetail?.id).toBe("2");
    });
  });

  describe("addToCollection", () => {
    it("calls service and re-fetches collection", async () => {
      mockService.addToCollection.mockResolvedValue(undefined);
      mockService.getMyCollection.mockResolvedValue(
        makeResponse([makeCoffee()]),
      );

      await useCoffeeStore.getState().addToCollection("1");

      expect(mockService.addToCollection).toHaveBeenCalledWith("1");
      expect(mockService.getMyCollection).toHaveBeenCalled();
    });
  });

  describe("removeFromCollection", () => {
    it("removes coffee from myCollection list", async () => {
      const coffee = makeCoffee({ id: "1" });
      useCoffeeStore.setState({ myCollection: [coffee] });
      mockService.removeFromCollection.mockResolvedValue(undefined);

      await useCoffeeStore.getState().removeFromCollection("1");

      expect(useCoffeeStore.getState().myCollection).toHaveLength(0);
    });
  });

  describe("fetchMyCollection", () => {
    it("fetches and sets collection with meta", async () => {
      const coffees = [makeCoffee({ id: "1" })];
      mockService.getMyCollection.mockResolvedValue(makeResponse(coffees));

      await useCoffeeStore.getState().fetchMyCollection();

      expect(useCoffeeStore.getState().myCollection).toEqual(coffees);
      expect(useCoffeeStore.getState().collectionMeta).toBeTruthy();
    });
  });

  describe("loadMoreCollection", () => {
    it("appends to existing collection", async () => {
      useCoffeeStore.setState({
        myCollection: [makeCoffee({ id: "1" })],
        collectionMeta: makeMeta({ page: 1, hasNextPage: true }),
      });
      mockService.getMyCollection.mockResolvedValue(
        makeResponse([makeCoffee({ id: "2" })], { page: 2 }),
      );

      await useCoffeeStore.getState().loadMoreCollection();

      expect(useCoffeeStore.getState().myCollection).toHaveLength(2);
    });
  });

  describe("fetchMyCreations", () => {
    it("fetches and sets creations with meta", async () => {
      const coffees = [makeCoffee({ id: "1", isCreator: true })];
      mockService.getMyCreations.mockResolvedValue(makeResponse(coffees));

      await useCoffeeStore.getState().fetchMyCreations();

      expect(useCoffeeStore.getState().myCreations).toEqual(coffees);
      expect(useCoffeeStore.getState().creationsMeta).toBeTruthy();
    });
  });

  describe("loadMoreCreations", () => {
    it("appends to existing creations", async () => {
      useCoffeeStore.setState({
        myCreations: [makeCoffee({ id: "1" })],
        creationsMeta: makeMeta({ page: 1, hasNextPage: true }),
      });
      mockService.getMyCreations.mockResolvedValue(
        makeResponse([makeCoffee({ id: "2" })], { page: 2 }),
      );

      await useCoffeeStore.getState().loadMoreCreations();

      expect(useCoffeeStore.getState().myCreations).toHaveLength(2);
    });
  });

  describe("setCoffeeDetail", () => {
    it("sets coffee detail", () => {
      const coffee = makeCoffee();
      useCoffeeStore.getState().setCoffeeDetail(coffee);
      expect(useCoffeeStore.getState().coffeeDetail).toEqual(coffee);
    });

    it("clears coffee detail with null", () => {
      useCoffeeStore.setState({ coffeeDetail: makeCoffee() });
      useCoffeeStore.getState().setCoffeeDetail(null);
      expect(useCoffeeStore.getState().coffeeDetail).toBeNull();
    });
  });

  describe("auth revocation listener", () => {
    it("resets all state when auth:revoked event is emitted", () => {
      useCoffeeStore.setState({
        coffees: [makeCoffee()],
        coffeesMeta: makeMeta(),
        myCollection: [makeCoffee()],
        collectionMeta: makeMeta(),
        myCreations: [makeCoffee()],
        creationsMeta: makeMeta(),
        coffeeDetail: makeCoffee(),
        isLoading: true,
        isLoadingMore: true,
      });

      authEvents.emit(AUTH_EVENTS.REVOKED);

      const state = useCoffeeStore.getState();
      expect(state.coffees).toEqual([]);
      expect(state.coffeesMeta).toBeNull();
      expect(state.myCollection).toEqual([]);
      expect(state.collectionMeta).toBeNull();
      expect(state.myCreations).toEqual([]);
      expect(state.creationsMeta).toBeNull();
      expect(state.coffeeDetail).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isLoadingMore).toBe(false);
    });
  });
});
