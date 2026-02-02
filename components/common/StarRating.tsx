import React from "react";
import { View, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxStars?: number;
  size?: number;
  color?: string;
  emptyColor?: string;
  containerStyle?: ViewStyle;
}

export const StarRating = ({
  rating,
  onRatingChange,
  maxStars = 5,
  size = 18,
  color,
  emptyColor,
  containerStyle,
}: StarRatingProps) => {
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  const starColor = color || tintColor;
  const starEmptyColor = emptyColor || iconColor;
  const clampedRating = Math.max(0, Math.min(maxStars, rating));
  const isInteractive = !!onRatingChange;

  const renderStar = (position: number) => {
    let iconName: "star" | "star-half" | "star-outline";
    let iconColorToUse: string;

    if (clampedRating >= position) {
      iconName = "star";
      iconColorToUse = starColor;
    } else if (!isInteractive && clampedRating >= position - 0.5) {
      // Half stars only in display mode
      iconName = "star-half";
      iconColorToUse = starColor;
    } else {
      iconName = "star-outline";
      iconColorToUse = starEmptyColor;
    }

    const star = (
      <Ionicons
        key={position}
        name={iconName}
        size={size}
        color={iconColorToUse}
      />
    );

    if (isInteractive) {
      return (
        <TouchableOpacity
          key={position}
          onPress={() => onRatingChange(position)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          {star}
        </TouchableOpacity>
      );
    }

    return star;
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
    gap: 4,
  },
});
