import { CoffeeCard } from "@/components/coffee/CoffeeCard";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeStore } from "@/stores/coffeeStore";
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";

const HomeScreen = () => {
  const text = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const cardBackground = useThemeColor({}, "cardBackground");
  const { t } = useTranslation();

  const { coffees, isLoading, fetchCoffees } = useCoffeeStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCoffees();
  }, []);

  const loadCoffees = async () => {
    try {
      await fetchCoffees();
    } catch (error) {
      // Error handling can be done in UI layer
      console.error("Failed to load coffees:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCoffees();
    setRefreshing(false);
  };

  const handleCoffeePress = (coffeeId: string) => {
    // TODO: Navigate to coffee detail screen
    console.log("Coffee pressed:", coffeeId);
  };

  const handleAddCoffee = () => {
    // TODO: Navigate to create coffee screen
    console.log("Add coffee pressed");
  };

  return (
    <ScreenLayout
      loading={isLoading && coffees.length === 0}
      isEmpty={!isLoading && coffees.length === 0}
      emptyIcon="cafe-outline"
      emptyTitle={t("home.noCoffeesYet")}
      emptyMessage={t("home.noCoffeesMessage")}
      onRetry={loadCoffees}
    >
      {/* Coffee list */}
      <FlatList
        data={coffees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CoffeeCard
            coffee={item}
            onPress={() => handleCoffeePress(item.id)}
            backgroundColor={cardBackground}
            textColor={text}
            iconColor={icon}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tint}
          />
        }
      />

      {/* FAB - Floating Action Button */}
      <View style={styles.fabContainer}>
        <FloatingActionButton onPress={handleAddCoffee} />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 55,
  },
});

export default HomeScreen;
