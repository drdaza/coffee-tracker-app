import { useTastingStore } from "@/stores/tastingStore";
import { authEvents, AUTH_EVENTS } from "@/utils/authEvents";
import { makeTasting } from "@/__tests__/factories";

// Mock the tasting service
jest.mock("@/api/tasting/service", () => ({
  tastingService: {
    getTastings: jest.fn(),
    getTasting: jest.fn(),
    createTasting: jest.fn(),
    updateTasting: jest.fn(),
    deleteTasting: jest.fn(),
    getCoffeeTastings: jest.fn(),
  },
}));

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

import { tastingService } from "@/api/tasting/service";

const mockService = tastingService as jest.Mocked<typeof tastingService>;

const initialState = {
  coffeeTastings: [],
  tastingDetail: null,
  isLoading: false,
};

describe("tastingStore", () => {
  beforeEach(() => {
    useTastingStore.setState(initialState);
    jest.clearAllMocks();
  });

  describe("fetchCoffeeTastings", () => {
    it("fetches and sets tastings for a coffee", async () => {
      const tastings = [makeTasting({ id: "t1" }), makeTasting({ id: "t2" })];
      mockService.getCoffeeTastings.mockResolvedValue(tastings);

      await useTastingStore.getState().fetchCoffeeTastings("c1");

      expect(useTastingStore.getState().coffeeTastings).toEqual(tastings);
      expect(mockService.getCoffeeTastings).toHaveBeenCalledWith("c1");
    });

    it("manages isLoading state", async () => {
      let resolve: () => void;
      mockService.getCoffeeTastings.mockImplementation(
        () => new Promise((r) => { resolve = () => r([]); }),
      );

      const promise = useTastingStore.getState().fetchCoffeeTastings("c1");
      expect(useTastingStore.getState().isLoading).toBe(true);

      resolve!();
      await promise;
      expect(useTastingStore.getState().isLoading).toBe(false);
    });

    it("resets isLoading on error", async () => {
      mockService.getCoffeeTastings.mockRejectedValue(new Error("Failed"));

      await expect(
        useTastingStore.getState().fetchCoffeeTastings("c1"),
      ).rejects.toThrow();

      expect(useTastingStore.getState().isLoading).toBe(false);
    });
  });

  describe("fetchTasting", () => {
    it("fetches and sets tasting detail", async () => {
      const tasting = makeTasting({ id: "t1" });
      mockService.getTasting.mockResolvedValue(tasting);

      await useTastingStore.getState().fetchTasting("t1");

      expect(useTastingStore.getState().tastingDetail).toEqual(tasting);
    });
  });

  describe("createTasting", () => {
    it("prepends new tasting and returns it", async () => {
      const existing = [makeTasting({ id: "t1" })];
      useTastingStore.setState({ coffeeTastings: existing });

      const newTasting = makeTasting({ id: "t2" });
      mockService.createTasting.mockResolvedValue(newTasting);

      const result = await useTastingStore
        .getState()
        .createTasting("c1", { aroma: 8 });

      expect(result).toEqual(newTasting);
      expect(useTastingStore.getState().coffeeTastings[0]).toEqual(newTasting);
      expect(useTastingStore.getState().coffeeTastings).toHaveLength(2);
    });
  });

  describe("updateTasting", () => {
    it("updates tasting in list and detail", async () => {
      const original = makeTasting({ id: "t1", aroma: 5 });
      const updated = makeTasting({ id: "t1", aroma: 9 });

      useTastingStore.setState({
        coffeeTastings: [original],
        tastingDetail: original,
      });
      mockService.updateTasting.mockResolvedValue(updated);

      const result = await useTastingStore
        .getState()
        .updateTasting("t1", { aroma: 9 });

      expect(result.aroma).toBe(9);
      expect(useTastingStore.getState().coffeeTastings[0].aroma).toBe(9);
      expect(useTastingStore.getState().tastingDetail?.aroma).toBe(9);
    });

    it("does not update tastingDetail when viewing different tasting", async () => {
      const t1 = makeTasting({ id: "t1" });
      const t2 = makeTasting({ id: "t2" });
      const updatedT1 = makeTasting({ id: "t1", aroma: 10 });

      useTastingStore.setState({
        coffeeTastings: [t1, t2],
        tastingDetail: t2,
      });
      mockService.updateTasting.mockResolvedValue(updatedT1);

      await useTastingStore.getState().updateTasting("t1", { aroma: 10 });

      expect(useTastingStore.getState().tastingDetail?.id).toBe("t2");
    });
  });

  describe("deleteTasting", () => {
    it("removes tasting from list and clears detail if matching", async () => {
      const tasting = makeTasting({ id: "t1" });
      useTastingStore.setState({
        coffeeTastings: [tasting],
        tastingDetail: tasting,
      });
      mockService.deleteTasting.mockResolvedValue(undefined);

      await useTastingStore.getState().deleteTasting("t1");

      expect(useTastingStore.getState().coffeeTastings).toHaveLength(0);
      expect(useTastingStore.getState().tastingDetail).toBeNull();
    });

    it("preserves tastingDetail when deleting different tasting", async () => {
      const t1 = makeTasting({ id: "t1" });
      const t2 = makeTasting({ id: "t2" });

      useTastingStore.setState({
        coffeeTastings: [t1, t2],
        tastingDetail: t2,
      });
      mockService.deleteTasting.mockResolvedValue(undefined);

      await useTastingStore.getState().deleteTasting("t1");

      expect(useTastingStore.getState().tastingDetail?.id).toBe("t2");
      expect(useTastingStore.getState().coffeeTastings).toHaveLength(1);
    });
  });

  describe("setTastingDetail", () => {
    it("sets tasting detail", () => {
      const tasting = makeTasting();
      useTastingStore.getState().setTastingDetail(tasting);
      expect(useTastingStore.getState().tastingDetail).toEqual(tasting);
    });

    it("clears tasting detail with null", () => {
      useTastingStore.setState({ tastingDetail: makeTasting() });
      useTastingStore.getState().setTastingDetail(null);
      expect(useTastingStore.getState().tastingDetail).toBeNull();
    });
  });

  describe("clearCoffeeTastings", () => {
    it("clears tastings list and detail", () => {
      useTastingStore.setState({
        coffeeTastings: [makeTasting()],
        tastingDetail: makeTasting(),
      });

      useTastingStore.getState().clearCoffeeTastings();

      expect(useTastingStore.getState().coffeeTastings).toEqual([]);
      expect(useTastingStore.getState().tastingDetail).toBeNull();
    });
  });

  describe("auth revocation listener", () => {
    it("resets all state when auth:revoked event is emitted", () => {
      useTastingStore.setState({
        coffeeTastings: [makeTasting()],
        tastingDetail: makeTasting(),
        isLoading: true,
      });

      authEvents.emit(AUTH_EVENTS.REVOKED);

      const state = useTastingStore.getState();
      expect(state.coffeeTastings).toEqual([]);
      expect(state.tastingDetail).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });
});
