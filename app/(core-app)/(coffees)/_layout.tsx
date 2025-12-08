import { Tabs } from "expo-router";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { Ionicons } from "@expo/vector-icons";

export default function CoffeesLayout() {
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: background,
        },
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: text,
      }}
    >
      <Tabs.Screen
        name="(my-collection)/index"
        options={{
          title: t("coffees.myCollection"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(my-creations)/index"
        options={{
          title: t("coffees.myCreations"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
