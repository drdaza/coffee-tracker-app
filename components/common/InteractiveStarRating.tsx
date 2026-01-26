import React from "react";
import { View, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

interface InteractiveStarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
  size?: number;
  color?: string;
  emptyColor?: string;
  containerStyle?: ViewStyle;
}

export const InteractiveStarRating = ({
  rating,
  onRatingChange,
  maxStars = 5,
  size = 32,
  color,
  emptyColor,
  containerStyle,
}: InteractiveStarRatingProps) => {
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  const starColor = color || tintColor;
  const starEmptyColor = emptyColor || iconColor;

  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starPosition = i + 1;
        const isFilled = rating >= starPosition;

        return (
          <TouchableOpacity
            key={i}
            onPress={() => onRatingChange(starPosition)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Ionicons
              name={isFilled ? "star" : "star-outline"}
              size={size}
              color={isFilled ? starColor : starEmptyColor}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
  },
});
