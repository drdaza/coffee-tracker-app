import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function CoffeeDetailLayout() {
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const { t } = useTranslation();

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: background,
        },
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: text,
        tabBarIndicatorStyle: {
          backgroundColor: tint,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600",
          textTransform: "none",
        },
      }}
    >
      <MaterialTopTabs.Screen
        name="(graphics)/index"
        options={{
          title: t("coffeeDetail.graphics"),
        }}
      />
      <MaterialTopTabs.Screen
        name="(information)/index"
        options={{
          title: t("coffeeDetail.information"),
        }}
      />
    </MaterialTopTabs>
  );
}
