import { renderHook, act } from "@testing-library/react-native";
import { useCoffeeFilters, MIN_SEARCH_LENGTH } from "@/hooks/coffee/useCoffeeFilters";

describe("useCoffeeFilters", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("initial state", () => {
    it("returns default filter values", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      expect(result.current.filters).toEqual({
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        minRate: undefined,
      });
      expect(result.current.searchText).toBe("");
      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.queryParams).toEqual({});
    });
  });

  describe("search text debounce", () => {
    it("does not update filters.search immediately", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("espresso");
      });

      // searchText updates immediately, filters.search does not
      expect(result.current.searchText).toBe("espresso");
      expect(result.current.filters.search).toBe("");
    });

    it("updates filters.search after debounce delay", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("espresso");
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.filters.search).toBe("espresso");
    });

    it("ignores search text shorter than minimum length", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("a");
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.filters.search).toBe("");
    });

    it("accepts search text at exactly minimum length", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      const minLengthText = "ab";
      expect(minLengthText.length).toBe(MIN_SEARCH_LENGTH);

      act(() => {
        result.current.setSearchText(minLengthText);
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.filters.search).toBe(minLengthText);
    });

    it("trims whitespace from search text", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("  espresso  ");
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.filters.search).toBe("espresso");
    });

    it("resets debounce timer on rapid typing", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("esp");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      act(() => {
        result.current.setSearchText("espresso");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Still within debounce of the second input
      expect(result.current.filters.search).toBe("");

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(result.current.filters.search).toBe("espresso");
    });

    it("clears filters.search when text is cleared", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("espresso");
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current.filters.search).toBe("espresso");

      act(() => {
        result.current.setSearchText("");
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current.filters.search).toBe("");
    });
  });

  describe("sort filters", () => {
    it("updates sortBy", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSortBy("name");
      });

      expect(result.current.filters.sortBy).toBe("name");
    });

    it("updates sortOrder", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSortOrder("asc");
      });

      expect(result.current.filters.sortOrder).toBe("asc");
    });
  });

  describe("minRate filter", () => {
    it("updates minRate", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setMinRate(4);
      });

      expect(result.current.filters.minRate).toBe(4);
    });

    it("clears minRate with undefined", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setMinRate(4);
      });
      act(() => {
        result.current.setMinRate(undefined);
      });

      expect(result.current.filters.minRate).toBeUndefined();
    });
  });

  describe("hasActiveFilters", () => {
    it("returns false with default filters", () => {
      const { result } = renderHook(() => useCoffeeFilters());
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it("returns true when search is active", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("espresso");
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("returns true when sortBy differs from default", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSortBy("name");
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("returns true when sortOrder differs from default", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSortOrder("asc");
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("returns true when minRate is set", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setMinRate(3);
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });
  });

  describe("queryParams", () => {
    it("returns empty object with defaults", () => {
      const { result } = renderHook(() => useCoffeeFilters());
      expect(result.current.queryParams).toEqual({});
    });

    it("includes search when active", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("latte");
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.queryParams.search).toBe("latte");
    });

    it("excludes search when below minimum length", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("a");
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.queryParams.search).toBeUndefined();
    });

    it("includes sortBy only when not default", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      // Default (createdAt) should not be included
      expect(result.current.queryParams.sortBy).toBeUndefined();

      act(() => {
        result.current.setSortBy("price");
      });

      expect(result.current.queryParams.sortBy).toBe("price");
    });

    it("includes sortOrder only when not default", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      // Default (desc) should not be included
      expect(result.current.queryParams.sortOrder).toBeUndefined();

      act(() => {
        result.current.setSortOrder("asc");
      });

      expect(result.current.queryParams.sortOrder).toBe("asc");
    });

    it("includes minRate when set", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setMinRate(4);
      });

      expect(result.current.queryParams.minRate).toBe(4);
    });

    it("combines multiple active params", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("espresso");
        result.current.setSortBy("name");
        result.current.setSortOrder("asc");
        result.current.setMinRate(3);
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.queryParams).toEqual({
        search: "espresso",
        sortBy: "name",
        sortOrder: "asc",
        minRate: 3,
      });
    });
  });

  describe("clearFilters", () => {
    it("resets all filters and search text to defaults", () => {
      const { result } = renderHook(() => useCoffeeFilters());

      act(() => {
        result.current.setSearchText("espresso");
        result.current.setSortBy("name");
        result.current.setSortOrder("asc");
        result.current.setMinRate(4);
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.searchText).toBe("");
      expect(result.current.filters).toEqual({
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        minRate: undefined,
      });
      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.queryParams).toEqual({});
    });
  });
});
