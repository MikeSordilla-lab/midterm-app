import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/use-auth";
import LoginScreen from "./login";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return null;
  }

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      {/* Explore tab removed. Only Home tab remains. */}
    </Tabs>
  );
}
