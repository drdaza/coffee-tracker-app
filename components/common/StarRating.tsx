import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface StarRatingProps {
  rating: number; // 0 to 5, supports decimals
  maxStars?: number;
  size?: number;
  color?: string;
  containerStyle?: ViewStyle;
}

export const StarRating = ({
  rating,
  maxStars = 5,
  size = 18,
  color = "#D4A574",
  containerStyle,
}: StarRatingProps) => {
  const clampedRating = Math.max(0, Math.min(maxStars, rating));

  const renderStar = (position: number) => {
    const diff = clampedRating - position;

    if (diff >= 1) {
      // Full star
      return <Ionicons key={position} name="star" size={size} color={color} />;
    } else if (diff > 0 && diff < 1) {
      // Half star
      return (
        <Ionicons key={position} name="star-half" size={size} color={color} />
      );
    } else {
      // Empty star
      return (
        <Ionicons
          key={position}
          name="star-outline"
          size={size}
          color={color}
        />
      );
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length: maxStars }, (_, i) => renderStar(i + 1))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 2,
  },
});
