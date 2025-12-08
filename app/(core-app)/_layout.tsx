import { AuthStatus } from "@/constants/authStatus";
import { useAuthStore } from "@/stores/authStore";
import { Redirect } from "expo-router";
import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export default function TabLayout() {
  const authStatus = useAuthStore((state) => state.authStatus);
  const tint = useThemeColor({}, "tint");
  const background = useThemeColor({}, "background");
  const { t } = useTranslation();

  if (authStatus === AuthStatus.LOGGED_OUT) {
    return <Redirect href="/auth/login" />;
  }

  return (
    // <Stack
    //   screenOptions={{ headerShown: false }}>
    //   <Stack.Screen
    //     name="(home)/index"
    //     options={{
    //       title: 'Home',
    //     }}
    //   />

    // </Stack>
    <Drawer
      screenOptions={{
        headerTitle: "Coffee Tracker",
        headerTitleStyle: {
          color: tint,
        },
        headerStyle: {
          backgroundColor: background,
        },
        drawerActiveTintColor: tint,
        headerShadowVisible: false,
        drawerStyle: {
          backgroundColor: background,
        },
        drawerContentStyle: {
          backgroundColor: background,
        },
      }}
    >
      <Drawer.Screen
        name="(coffees)"
        options={{
          title: "Coffees",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cafe-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="(home)/index"
        options={{
          title: t("home.title"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
