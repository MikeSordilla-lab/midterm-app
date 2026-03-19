/**
 * Login Page
 * Admin authentication screen
 */

import React, { useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  StatusBar,
} from "react-native";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/hooks/use-auth";
import { LightTheme, DarkTheme } from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function LoginScreen() {
  const { login, error, loading } = useAuth();

  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb";
  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      try {
        await login(username, password);
        // Navigation will be handled by the layout when auth state changes
      } catch (err) {
        console.error("Login failed:", err);
      }
    },
    [login],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={themeColors.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <LoginForm onSubmit={handleLogin} isLoading={loading} error={error} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
