import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { getEnvironmentInfo } from "@/services/config";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Log environment info on app start
    const envInfo = getEnvironmentInfo();
    console.log("=== Expo App Environment ===");
    console.log("Environment Info:", JSON.stringify(envInfo, null, 2));
    console.log("Base URL:", envInfo.baseURL);
    console.log(
      "Running in:",
      envInfo.isNative ? "NATIVE (Mobile/Emulator)" : "WEB (Browser)",
    );
    if (envInfo.isNative) {
      console.log(
        "Note: If running on Android Emulator, API_IP should be 10.0.2.2",
      );
      console.log(
        "Note: If running on real device, update API_IP to your PC's IPv4 (find with: ipconfig)",
      );
    }
    console.log("============================");
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
