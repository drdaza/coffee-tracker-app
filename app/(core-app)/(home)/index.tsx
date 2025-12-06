import { CoffeeCard } from "@/components/coffee/CoffeeCard";
import { Loader } from "@/components/common/Loader";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
} from "react-native";

const HomeScreen = () => {
  const background = useThemeColor({}, "background");
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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cafe-outline" size={64} color={icon} />
      <Text style={[styles.emptyTitle, { color: text }]}>
        {t("home.noCoffeesYet")}
      </Text>
      <Text style={[styles.emptyMessage, { color: icon }]}>
        {t("home.noCoffeesMessage")}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* Sort section */}
      {/*<View style={styles.sortContainer}>
        <Pressable style={styles.sortButton}>
          <Text style={[styles.sortText, { color: text }]}>
            {t("home.sortLabel")} {t("home.sortMostRecent")}
          </Text>
          <Ionicons name="chevron-down" size={20} color={text} />
        </Pressable>
        <Pressable onPress={handleAddCoffee}>
          <Ionicons name="chevron-forward" size={24} color={text} />
        </Pressable>
      </View>*/}

      {/* Coffee list */}
      {isLoading && coffees.length === 0 ? (
        <Loader />
      ) : (
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
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={tint}
            />
          }
        />
      )}

      {/* FAB - Floating Action Button */}
      <Pressable
        style={[styles.fab, { backgroundColor: tint }]}
        onPress={handleAddCoffee}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sortText: {
    fontSize: 16,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HomeScreen;
