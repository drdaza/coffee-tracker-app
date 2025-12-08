import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { Coffee } from "@/api/coffee";
import { useFormatDate } from "@/hooks/utils/useFormatDate";
import { StarRating } from "@/components/common/StarRating";

export interface CoffeeCardProps {
  coffee: Coffee;
  onPress?: () => void;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
}
const BrewingMethodIcon = ({
  size = 32,
  color,
}: {
  size?: number;
  color: string;
}) => {
  return <Ionicons name="cafe" size={size} color={color} />;
};

export const CoffeeCard = ({
  coffee,
  onPress,
  backgroundColor,
  textColor,
  iconColor,
}: CoffeeCardProps) => {
  const { formatDate } = useFormatDate();

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[styles.card, { backgroundColor, opacity: pressed ? 0.7 : 1 }]}
        >
          <View style={styles.content}>
            {/* Left side: Coffee icon placeholder */}
            <View
              style={[styles.imagePlaceholder, { backgroundColor: iconColor }]}
            >
              <Ionicons name="cafe" size={32} color={backgroundColor} />
            </View>

            {/* Middle: Coffee info */}
            <View style={styles.infoContainer}>
              <Text
                style={[styles.coffeeName, { color: textColor }]}
                numberOfLines={1}
              >
                {coffee.name}
              </Text>
              <Text
                style={[styles.roasterName, { color: iconColor }]}
                numberOfLines={1}
              >
                {coffee.roaster}
              </Text>
              {coffee.rate !== undefined && coffee.rate > 0 && (
                <StarRating
                  rating={coffee.rate}
                  containerStyle={styles.ratingContainer}
                />
              )}
              <View style={styles.dateContainer}>
                <Ionicons name="calendar" size={14} color={iconColor} />
                <Text style={[styles.date, { color: iconColor }]}>
                  {formatDate(coffee.createdAt)}
                </Text>
              </View>
            </View>

            {/* Right side: Brewing method icon */}
            <View style={styles.brewingMethodContainer}>
              <BrewingMethodIcon color={iconColor} />
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  coffeeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  roasterName: {
    fontSize: 14,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 2,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 13,
  },
  brewingMethodContainer: {
    marginLeft: 12,
    justifyContent: "center",
  },
});
