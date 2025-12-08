import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  containerStyle?: ViewStyle;
}

export const EmptyState = ({
  icon = "information-circle-outline",
  title,
  message,
  containerStyle,
}: EmptyStateProps) => {
  const text = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name={icon} size={64} color={iconColor} />
      <Text style={[styles.title, { color: text }]}>{title}</Text>
      <Text style={[styles.message, { color: iconColor }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});
