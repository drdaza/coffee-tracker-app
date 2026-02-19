import { CoffeeList } from "@/components/coffee/CoffeeList";
import { CoffeeSearchBar } from "@/components/coffee/CoffeeSearchBar";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeFilters } from "@/hooks/coffee/useCoffeeFilters";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { useCoffeeList } from "@/hooks/coffee/useCoffeeList";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

export default function MyCreationsScreen() {
  const { t } = useTranslation();
  const {
    myCreations,
    creationsMeta,
    isLoading,
    isLoadingMore,
    fetchMyCreations,
    loadMoreCreations,
  } = useCoffeeStore();
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

  const loadCoffees = useCallback(async () => {
    try {
      await fetchMyCreations(queryParams);
    } catch (error) {
      console.error("Failed to load creations:", error);
    }
  }, [fetchMyCreations, queryParams]);

  useEffect(() => {
    loadCoffees();
  }, [loadCoffees]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCoffees();
    setRefreshing(false);
  }, [loadCoffees]);

  const onEndReached = useCallback(() => {
    if (!isLoadingMore && creationsMeta?.hasNextPage) {
      loadMoreCreations(queryParams).catch((error) => {
        console.error("Failed to load more creations:", error);
      });
    }
  }, [
    isLoadingMore,
    creationsMeta?.hasNextPage,
    loadMoreCreations,
    queryParams,
  ]);

  const isEmpty = !isLoading && myCreations.length === 0;
  const emptyTitle = hasActiveFilters
    ? t("search.noResults")
    : t("creations.empty");
  const emptyMessage = hasActiveFilters
    ? t("search.noResultsMessage")
    : t("creations.emptyMessage");

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
      loading={isLoading && myCreations.length === 0 && !hasActiveFilters}
      isEmpty={isEmpty}
      emptyIcon={hasActiveFilters ? "search-outline" : "cafe-outline"}
      emptyTitle={emptyTitle}
      emptyMessage={emptyMessage}
      onRetry={hasActiveFilters ? clearFilters : loadCoffees}
    >
      <CoffeeList
        coffees={myCreations}
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
