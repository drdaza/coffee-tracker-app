import { AuthStatus } from "@/constants/authStatus";
import { useAuthStore } from "@/stores/authStore";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Loader } from "@/components/common/Loader";
import { View } from "react-native";

export default function TabLayout() {
  const { authStatus, initializeAuth } = useAuthStore();
  const tint = useThemeColor({}, "tint");
  const background = useThemeColor({}, "background");

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (authStatus === AuthStatus.CHECKING) {
    return (
      <View style={{ flex: 1, backgroundColor: background }}>
        <Loader />
      </View>
    );
  }

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
    </Drawer>
  );
}
