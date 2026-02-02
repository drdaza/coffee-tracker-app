import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export default function CoffeesLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { t } = useTranslation();

  const headerLeft = () => (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{ padding: 8, marginLeft: -8 }}
    >
      <Ionicons name="arrow-back" size={24} color={textColor} />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="(create)/index"
        options={{
          headerShown: true,
          title: t("coffees.addCoffee"),
          headerStyle: { backgroundColor },
          headerTintColor: textColor,
          headerLeft,
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          headerShown: true,
          title: t("coffees.editCoffee"),
          headerStyle: { backgroundColor },
          headerTintColor: textColor,
          headerLeft,
        }}
      />
    </Stack>
  );
}
