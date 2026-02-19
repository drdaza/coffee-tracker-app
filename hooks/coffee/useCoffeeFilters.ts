import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CoffeeQueryParams } from "@/api/coffee";

type SortByField = "name" | "price" | "rate" | "createdAt";
type SortOrder = "asc" | "desc";

interface FilterState {
  search: string;
  sortBy: SortByField;
  sortOrder: SortOrder;
  minRate: number | undefined;
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  minRate: undefined,
};

export const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_MS = 500;

export function useCoffeeFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchText, setSearchText] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce: update filters.search after 500ms of no typing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setFilters((prev) => {
        const trimmed = searchText.trim();
        const value = trimmed.length >= MIN_SEARCH_LENGTH ? trimmed : "";
        if (prev.search === value) return prev;
        return { ...prev, search: value };
      });
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchText]);

  const setSortBy = useCallback((sortBy: SortByField) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const setSortOrder = useCallback((sortOrder: SortOrder) => {
    setFilters((prev) => ({ ...prev, sortOrder }));
  }, []);

  const setMinRate = useCallback((minRate: number | undefined) => {
    setFilters((prev) => ({ ...prev, minRate }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchText("");
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.sortBy !== DEFAULT_FILTERS.sortBy ||
    filters.sortOrder !== DEFAULT_FILTERS.sortOrder ||
    filters.minRate !== undefined;

  const queryParams = useMemo((): CoffeeQueryParams => {
    const params: CoffeeQueryParams = {};

    if (filters.search.length >= MIN_SEARCH_LENGTH) {
      params.search = filters.search;
    }
    if (filters.sortBy !== "createdAt") {
      params.sortBy = filters.sortBy;
    }
    if (filters.sortOrder !== "desc") {
      params.sortOrder = filters.sortOrder;
    }
    if (filters.minRate !== undefined) {
      params.minRate = filters.minRate;
    }

    return params;
  }, [filters.search, filters.sortBy, filters.sortOrder, filters.minRate]);

  return {
    filters,
    searchText,
    setSearchText,
    queryParams,
    hasActiveFilters,
    setSortBy,
    setSortOrder,
    setMinRate,
    clearFilters,
  };
}
