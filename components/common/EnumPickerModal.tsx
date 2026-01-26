import React from "react";
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

interface EnumPickerModalProps<T extends string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: T[];
  labels: Record<T, string>;
  selectedValue: T | null;
  onSelect: (value: T | null) => void;
  allowNone?: boolean;
  noneLabel?: string;
}

export function EnumPickerModal<T extends string>({
  visible,
  onClose,
  title,
  options,
  labels,
  selectedValue,
  onSelect,
  allowNone = true,
  noneLabel = "None",
}: EnumPickerModalProps<T>) {
  const cardBackground = useThemeColor({}, "cardBackground");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({}, "border");

  const handleSelect = (value: T | null) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.content, { backgroundColor: cardBackground }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <ThemedText type="subtitle">{title}</ThemedText>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.options} showsVerticalScrollIndicator={false}>
            {/* None option */}
            {allowNone && (
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  selectedValue === null && {
                    backgroundColor: tintColor + "20",
                  },
                ]}
                onPress={() => handleSelect(null)}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={
                    selectedValue === null ? { color: tintColor } : undefined
                  }
                >
                  {noneLabel}
                </ThemedText>
                {selectedValue === null && (
                  <Ionicons name="checkmark" size={20} color={tintColor} />
                )}
              </TouchableOpacity>
            )}

            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  selectedValue === option && {
                    backgroundColor: tintColor + "20",
                  },
                ]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={
                    selectedValue === option
                      ? { color: tintColor }
                      : undefined
                  }
                >
                  {labels[option]}
                </ThemedText>
                {selectedValue === option && (
                  <Ionicons name="checkmark" size={20} color={tintColor} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  options: {
    padding: 8,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
});
