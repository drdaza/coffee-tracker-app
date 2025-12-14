import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

export default function CoffeeGraphicsScreen() {
  const { id } = useLocalSearchParams();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.text, { color: text }]}>
        Coffee Graphics for ID: {id}
      </Text>
      <Text style={[styles.text, { color: text }]}>
        TODO: Add donut chart for flavor notes
      </Text>
      <Text style={[styles.text, { color: text }]}>
        TODO: Add radar chart for characteristics
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  text: {
    fontSize: 16,
  },
});
