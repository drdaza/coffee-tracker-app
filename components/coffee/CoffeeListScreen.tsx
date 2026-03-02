import { CoffeeList } from "@/components/coffee/CoffeeList";
import { CoffeeSearchBar } from "@/components/coffee/CoffeeSearchBar";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeFilters } from "@/hooks/coffee/useCoffeeFilters";
import { useCoffeeList } from "@/hooks/coffee/useCoffeeList";
import type { Coffee, CoffeeQueryParams, PaginationMeta } from "@/api/coffee";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import type { Ionicons } from "@expo/vector-icons";

interface CoffeeListScreenConfig {
  data: Coffee[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  fetch: (params?: CoffeeQueryParams) => Promise<void>;
  loadMore: (params?: CoffeeQueryParams) => Promise<void>;
  emptyIcon: keyof typeof Ionicons.glyphMap;
  emptyTitleKey: string;
  emptyMessageKey: string;
}

export function CoffeeListScreen({
  data,
  meta,
  isLoading,
  isLoadingMore,
  fetch: fetchData,
  loadMore,
  emptyIcon,
  emptyTitleKey,
  emptyMessageKey,
}: CoffeeListScreenConfig) {
  const { t } = useTranslation();
  const { handleCoffeePress, handleAddCoffee } = useCoffeeList();
  const {
    filters,
    searchText,
    setSearchText,
    queryParams,
    hasActiveFilters,
    setSortBy,
    setSortOrder,
    setMinRate,
    clearFilters,
  } = useCoffeeFilters();
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      await fetchData(queryParams);
    } catch (error) {
      console.error("Failed to load coffees:", error);
    }
  }, [fetchData, queryParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const onEndReached = useCallback(() => {
    if (!isLoadingMore && meta?.hasNextPage) {
      loadMore(queryParams).catch((error) => {
        console.error("Failed to load more coffees:", error);
      });
    }
  }, [isLoadingMore, meta?.hasNextPage, loadMore, queryParams]);

  const isEmpty = !isLoading && data.length === 0;
  const emptyTitle = hasActiveFilters
    ? t("search.noResults")
    : t(emptyTitleKey);
  const emptyMessage = hasActiveFilters
    ? t("search.noResultsMessage")
    : t(emptyMessageKey);

  return (
    <ScreenLayout
      headerComponent={
        <CoffeeSearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          minRate={filters.minRate}
          hasActiveFilters={hasActiveFilters}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onMinRateChange={setMinRate}
          onClearFilters={clearFilters}
        />
      }
      loading={isLoading && data.length === 0 && !hasActiveFilters}
      isEmpty={isEmpty}
      emptyIcon={hasActiveFilters ? "search-outline" : emptyIcon}
      emptyTitle={emptyTitle}
      emptyMessage={emptyMessage}
      onRetry={hasActiveFilters ? clearFilters : loadData}
    >
      <CoffeeList
        coffees={data}
        onCoffeePress={handleCoffeePress}
        onRefresh={onRefresh}
        isRefreshing={refreshing}
        onEndReached={onEndReached}
        isLoadingMore={isLoadingMore}
      />

      <View style={styles.fabContainer}>
        <FloatingActionButton onPress={handleAddCoffee} />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 55,
  },
});
