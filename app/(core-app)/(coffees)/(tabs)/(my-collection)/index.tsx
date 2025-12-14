import { CoffeeList } from "@/components/coffee/CoffeeList";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { useCoffeeList } from "@/hooks/coffee/useCoffeeList";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

export default function MyCollectionScreen() {
  const { t } = useTranslation();
  const { myCollection, isLoading, fetchMyCollection } = useCoffeeStore();
  const { handleCoffeePress, handleAddCoffee } = useCoffeeList();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCoffees();
  }, []);

  const loadCoffees = async () => {
    try {
      await fetchMyCollection();
    } catch (error) {
      console.error("Failed to load collection:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCoffees();
    setRefreshing(false);
  };

  return (
    <ScreenLayout
      loading={isLoading && myCollection.length === 0}
      isEmpty={!isLoading && myCollection.length === 0}
      emptyIcon="cafe-outline"
      emptyTitle={t("home.noCoffeesYet")}
      emptyMessage={t("home.noCoffeesMessage")}
      onRetry={loadCoffees}
    >
      <CoffeeList
        coffees={myCollection}
        onCoffeePress={handleCoffeePress}
        onRefresh={onRefresh}
        isRefreshing={refreshing}
      />

      {/* FAB - Floating Action Button */}
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
