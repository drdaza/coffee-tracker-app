import React, { useCallback } from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedText } from "@/components/ui/ThemedText";

interface ScoreInputProps {
  value: number;
  onValueChange?: (value: number) => void;
  maxScore?: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  label?: string;
  containerStyle?: ViewStyle;
}

export const ScoreInput = ({
  value,
  onValueChange,
  maxScore = 10,
  size = 28,
  activeColor,
  inactiveColor,
  label,
  containerStyle,
}: ScoreInputProps) => {
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({}, "border");

  const filledColor = activeColor || tintColor;
  const emptyColor = inactiveColor || iconColor;
  const isInteractive = !!onValueChange;

  const handlePress = useCallback(
    (score: number) => {
      if (!onValueChange) return;
      // Tap same value to deselect (set to 0)
      onValueChange(score === value ? 0 : score);
    },
    [onValueChange, value],
  );

  const renderCircle = (position: number) => {
    const isFilled = position <= value;

    const circle = (
      <View
        key={position}
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isFilled ? filledColor : "transparent",
            borderColor: isFilled ? filledColor : borderColor,
          },
        ]}
      >
        <ThemedText
          style={[
            styles.circleText,
            {
              fontSize: size * 0.4,
              color: isFilled ? "#fff" : emptyColor,
            },
          ]}
        >
          {position}
        </ThemedText>
      </View>
    );

    if (isInteractive) {
      return (
        <Pressable
          key={position}
          onPress={() => handlePress(position)}
          hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
        >
          {circle}
        </Pressable>
      );
    }

    return circle;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            {label}
          </ThemedText>
          <ThemedText style={[styles.valueText, { color: filledColor }]}>
            {value}/{maxScore}
          </ThemedText>
        </View>
      )}
      <View style={styles.circlesRow}>
        {Array.from({ length: maxScore }, (_, i) => renderCircle(i + 1))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
  },
  valueText: {
    fontSize: 15,
    fontWeight: "600",
  },
  circlesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  circleText: {
    fontWeight: "600",
  },
});
