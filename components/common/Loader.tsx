import { useThemeColor } from "@/hooks/theme/useThemeColor";
import React from "react";
import { View, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";

interface LoaderProps {
  size?: "small" | "large";
  containerStyle?: ViewStyle;
}

export const Loader = ({ size = "large", containerStyle }: LoaderProps) => {
  const tint = useThemeColor({}, "tint");

  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={size} color={tint} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
