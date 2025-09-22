import { AuthStatus } from '@/constants/authStatus';
import { useAuthStore } from '@/stores/authStore';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  const authStatus = useAuthStore((state) => state.authStatus);

  if (authStatus === AuthStatus.LOGGED_OUT) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(home)/index"
        options={{
          title: 'Home',
        }}
      />

    </Stack>
  );
}
