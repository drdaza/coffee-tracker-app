import { CoffeeList } from "@/components/coffee/CoffeeList";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { useCoffeeList } from "@/hooks/coffee/useCoffeeList";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

export default function MyCreationsScreen() {
  const { t } = useTranslation();
  const { myCreations, isLoading, fetchMyCreations } = useCoffeeStore();
  const { handleCoffeePress, handleAddCoffee } = useCoffeeList();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCoffees();
  }, []);

  const loadCoffees = async () => {
    try {
      await fetchMyCreations();
    } catch (error) {
      console.error("Failed to load creations:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCoffees();
    setRefreshing(false);
  };

  return (
    <ScreenLayout
      loading={isLoading && myCreations.length === 0}
      isEmpty={!isLoading && myCreations.length === 0}
      emptyIcon="cafe-outline"
      emptyTitle={t("home.noCoffeesYet")}
      emptyMessage={t("home.noCoffeesMessage")}
      onRetry={loadCoffees}
    >
      <CoffeeList
        coffees={myCreations}
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
