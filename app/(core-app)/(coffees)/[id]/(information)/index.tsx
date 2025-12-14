import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useCoffeeStore } from "@/stores/coffeeStore";

export default function CoffeeInformationScreen() {
  const { id } = useLocalSearchParams();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const { coffeeDetail } = useCoffeeStore();

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.text, { color: text }]}>{coffeeDetail?.name}</Text>
      <Text style={[styles.text, { color: text }]}>
        {coffeeDetail?.roaster}
      </Text>
      <Text style={[styles.text, { color: text }]}>
        {coffeeDetail?.creator.name}
      </Text>
      <Text style={[styles.text, { color: text }]}>{coffeeDetail?.origin}</Text>

      <Text style={[styles.text, { color: text }]}>
        {coffeeDetail?.brewingMethod}
      </Text>
      <Text style={[styles.text, { color: text }]}>
        {coffeeDetail?.description}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
});
