import { CoffeeCard } from "@/components/coffee/CoffeeCard";
import { Loader } from "@/components/common/Loader";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import type { Coffee } from "@/api/coffee";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, RefreshControl, View } from "react-native";

interface CoffeeListProps {
  coffees: Coffee[];
  onCoffeePress: (coffee: Coffee) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
}

export const CoffeeList = ({
  coffees,
  onCoffeePress,
  onRefresh,
  isRefreshing = false,
  onEndReached,
  isLoadingMore = false,
}: CoffeeListProps) => {
  const text = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const cardBackground = useThemeColor({}, "cardBackground");

  const renderItem = useCallback(
    ({ item }: { item: Coffee }) => (
      <CoffeeCard
        coffee={item}
        onPress={() => onCoffeePress(item)}
        backgroundColor={cardBackground}
        textColor={text}
        iconColor={icon}
      />
    ),
    [onCoffeePress, cardBackground, text, icon],
  );

  const keyExtractor = useCallback((item: Coffee) => item.id, []);

  const ListFooter = isLoadingMore ? (
    <View style={styles.footerLoader}>
      <Loader />
    </View>
  ) : null;

  return (
    <FlatList
      data={coffees}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ListFooterComponent={ListFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
