import React from "react";
import { View, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

interface PickerFieldProps {
  label: string;
  value: string | null | undefined;
  placeholder: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
}

export const PickerField = ({
  label,
  value,
  placeholder,
  onPress,
  icon = "chevron-down",
  containerStyle,
}: PickerFieldProps) => {
  const inputColor = useThemeColor({}, "input");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  return (
    <View style={[styles.container, containerStyle]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: inputColor, borderColor: tintColor },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <ThemedText
          style={[
            styles.buttonText,
            !value && { color: iconColor },
          ]}
        >
          {value || placeholder}
        </ThemedText>
        <Ionicons name={icon} size={20} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
  },
});
