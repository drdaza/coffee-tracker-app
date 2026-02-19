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

export default function MyCollectionScreen() {
  const { t } = useTranslation();
  const {
    myCollection,
    collectionMeta,
    isLoading,
    isLoadingMore,
    fetchMyCollection,
    loadMoreCollection,
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
      await fetchMyCollection(queryParams);
    } catch (error) {
      console.error("Failed to load collection:", error);
    }
  }, [fetchMyCollection, queryParams]);

  useEffect(() => {
    loadCoffees();
  }, [loadCoffees]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCoffees();
    setRefreshing(false);
  }, [loadCoffees]);

  const onEndReached = useCallback(() => {
    if (!isLoadingMore && collectionMeta?.hasNextPage) {
      loadMoreCollection(queryParams).catch((error) => {
        console.error("Failed to load more collection:", error);
      });
    }
  }, [
    isLoadingMore,
    collectionMeta?.hasNextPage,
    loadMoreCollection,
    queryParams,
  ]);

  const isEmpty = !isLoading && myCollection.length === 0;
  const emptyTitle = hasActiveFilters
    ? t("search.noResults")
    : t("collection.empty");
  const emptyMessage = hasActiveFilters
    ? t("search.noResultsMessage")
    : t("collection.emptyMessage");

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
      loading={isLoading && myCollection.length === 0 && !hasActiveFilters}
      isEmpty={isEmpty}
      emptyIcon={hasActiveFilters ? "search-outline" : "cafe-outline"}
      emptyTitle={emptyTitle}
      emptyMessage={emptyMessage}
      onRetry={hasActiveFilters ? clearFilters : loadCoffees}
    >
      <CoffeeList
        coffees={myCollection}
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
