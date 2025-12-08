import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const FloatingActionButton = ({
  onPress,
  icon = "add",
  iconSize = 32,
  iconColor = "#fff",
  backgroundColor,
  style,
}: FloatingActionButtonProps) => {
  const tint = useThemeColor({}, "tint");

  return (
    <Pressable
      style={[
        styles.fab,
        { backgroundColor: backgroundColor || tint },
        style,
      ]}
      onPress={onPress}
    >
      {({ pressed }) => (
        <Ionicons
          name={icon}
          size={iconSize}
          color={iconColor}
          style={{ opacity: pressed ? 0.7 : 1 }}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
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
