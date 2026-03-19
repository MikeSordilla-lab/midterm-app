/**
 * Login Form Component
 * Reusable form for user authentication
 */

import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { EnhancedTextInput } from "./ui/text-input";
import { EnhancedButton } from "./ui/button";
import {
  Spacing,
  BorderRadius,
  Typography,
  LightTheme,
  DarkTheme,
} from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb";
  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;

  const handleSubmit = useCallback(async () => {
    // Clear previous validation error
    setValidationError(null);

    // Validate inputs
    if (!username.trim()) {
      setValidationError("Username is required");
      return;
    }

    if (!password) {
      setValidationError("Password is required");
      return;
    }

    if (username.trim().length < 3) {
      setValidationError("Username must be at least 3 characters");
      return;
    }

    // Submit form
    try {
      await onSubmit(username, password);
      // Clear password on successful submission
      if (!error) {
        setPassword("");
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  }, [username, password, onSubmit, error]);

  const displayError = validationError || error;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.form}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: themeColors.text, fontWeight: "600" },
            ]}
          >
            Admin Panel Login
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: themeColors.textSecondary, fontWeight: "400" },
            ]}
          >
            Professional access only
          </Text>
        </View>

        {/* Username Input */}
        <View style={styles.inputContainer}>
          <EnhancedTextInput
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setValidationError(null);
            }}
            keyboardType="default"
            editable={!isLoading}
            error={displayError ? undefined : undefined}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <EnhancedTextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setValidationError(null);
            }}
            secureTextEntry
            editable={!isLoading}
            error={displayError ? undefined : undefined}
          />
        </View>

        {/* Error Message */}
        {displayError && (
          <View>
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: themeColors.error }]}>
                {displayError}
              </Text>
            </View>
            {/* Troubleshooting hints */}
            <View style={styles.hintContainer}>
              <Text style={[styles.hintTitle, { color: themeColors.warning }]}>
                💡 Troubleshooting:
              </Text>
              {displayError.includes("Connection") && (
                <Text
                  style={[styles.hintText, { color: themeColors.textTertiary }]}
                >
                  • Check your internet connection{"\n"}• Make sure PHP server
                  is running{"\n"}• Verify API URL is correct
                </Text>
              )}
              {displayError.includes("Database") && (
                <Text
                  style={[styles.hintText, { color: themeColors.textTertiary }]}
                >
                  • Database connection failed{"\n"}• Run DATABASE_SETUP.sql in
                  phpMyAdmin{"\n"}• Check database credentials in config.php
                </Text>
              )}
              {displayError.includes("Invalid") && (
                <Text
                  style={[styles.hintText, { color: themeColors.textTertiary }]}
                >
                  • Username: admin{"\n"}• Password: password123{"\n"}• Check
                  caps lock
                </Text>
              )}
              {!displayError.includes("Connection") &&
                !displayError.includes("Database") &&
                !displayError.includes("Invalid") && (
                  <Text
                    style={[
                      styles.hintText,
                      { color: themeColors.textTertiary },
                    ]}
                  >
                    • Try again{"\n"}• Clear browser cache{"\n"}• Check browser
                    console (F12)
                  </Text>
                )}
            </View>
          </View>
        )}

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <EnhancedButton
            title={isLoading ? "SIGNING IN..." : "SIGN IN"}
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            disabled={isLoading}
            loading={isLoading}
          />
        </View>

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text
            style={[styles.helperText, { color: themeColors.textTertiary }]}
          >
            Test credentials: admin / password123
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.bodySmall,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  errorContainer: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: BorderRadius.sm,
  },
  errorText: {
    ...Typography.caption,
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: Spacing.lg,
  },
  helperContainer: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  helperText: {
    ...Typography.caption,
    textAlign: "center",
  },
  hintContainer: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: "rgba(245, 158, 11, 0.5)",
  },
  hintTitle: {
    ...Typography.caption,
    fontWeight: "600" as const,
    marginBottom: Spacing.xs,
  },
  hintText: {
    ...Typography.caption,
    lineHeight: 18,
  },
});
