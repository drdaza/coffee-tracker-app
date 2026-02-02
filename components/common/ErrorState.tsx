import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { CustomButton } from "@/components/ui/CustomButton";
import { ThemedText } from "@/components/ui/ThemedText";

interface ErrorStateProps {
  message?: string;
  title?: string;
  onRetry?: () => void;
  containerStyle?: ViewStyle;
}

export const ErrorState = ({
  message = "Something went wrong. Please try again.",
  title = "Oops!",
  onRetry,
  containerStyle,
}: ErrorStateProps) => {
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="alert-circle-outline" size={64} color={icon} />
      <ThemedText style={[styles.title, { color: text }]}>{title}</ThemedText>
      <ThemedText style={[styles.message, { color: icon }]}>{message}</ThemedText>
      {onRetry && (
        <CustomButton
          label="Retry"
          onPress={onRetry}
          type="base"
          size="medium"
          style={styles.retryButton}
        />
      )}
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
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
});
