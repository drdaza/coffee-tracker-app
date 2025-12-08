import { CoffeeCard } from "@/components/coffee/CoffeeCard";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import type { Coffee } from "@/api/coffee";
import React from "react";
import { FlatList, StyleSheet, RefreshControl } from "react-native";

interface CoffeeListProps {
  coffees: Coffee[];
  onCoffeePress: (coffeeId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const CoffeeList = ({
  coffees,
  onCoffeePress,
  onRefresh,
  isRefreshing = false,
}: CoffeeListProps) => {
  const text = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const cardBackground = useThemeColor({}, "cardBackground");

  return (
    <FlatList
      data={coffees}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CoffeeCard
          coffee={item}
          onPress={() => onCoffeePress(item.id)}
          backgroundColor={cardBackground}
          textColor={text}
          iconColor={icon}
        />
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={tint}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
});
