/**
 * Enhanced TextInput Component
 * Includes labels, error messages, helper text
 * Mobile touch target: 48px height
 */

import React, { useState } from "react";
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  Text,
  ViewStyle,
  Platform,
} from "react-native";
import {
  Spacing,
  BorderRadius,
  Typography,
  LightTheme,
  DarkTheme,
} from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

interface EnhancedTextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  maxLength?: number;
  keyboardType?: "default" | "email-address" | "numeric" | "decimal-pad";
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  style?: ViewStyle;
}

export const EnhancedTextInput: React.FC<EnhancedTextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  maxLength,
  keyboardType = "default",
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb"; // Light text = dark mode

  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;

  const inputHeight = Platform.OS === "web" ? 40 : 48; // Larger on mobile
  const borderColor = isFocused
    ? themeColors.primary
    : error
      ? themeColors.error
      : themeColors.border;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: themeColors.text,
              fontFamily: Platform.select({
                ios: "System",
                android: "-apple-system",
                web: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                default: "sans-serif",
              }),
            },
          ]}
        >
          {label}
        </Text>
      )}

      <RNTextInput
        style={[
          styles.input,
          {
            height: multiline ? "auto" : inputHeight,
            minHeight: multiline ? 80 : inputHeight,
            borderColor,
            color: themeColors.text,
            backgroundColor: themeColors.surfaceBackground,
            placeholderTextColor: themeColors.textTertiary,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.md,
            fontSize: Typography.body.fontSize,
            lineHeight: Typography.body.lineHeight,
            borderBottomWidth: isFocused ? 2 : 1,
            borderRadius: BorderRadius.md,
            fontFamily: Platform.select({
              ios: "System",
              android: "-apple-system",
              web: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              default: "sans-serif",
            }),
          } as any,
        ]}
        placeholder={placeholder}
        placeholderTextColor={themeColors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={themeColors.primary}
      />

      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: themeColors.error,
              fontFamily: Platform.select({
                ios: "System",
                android: "-apple-system",
                web: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                default: "sans-serif",
              }),
            },
          ]}
        >
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text
          style={[
            styles.helperText,
            {
              color: themeColors.textSecondary,
              fontFamily: Platform.select({
                ios: "System",
                android: "-apple-system",
                web: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                default: "sans-serif",
              }),
            },
          ]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.label.fontSize,
    lineHeight: Typography.label.lineHeight,
    fontWeight: "600" as const,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
  },
  errorText: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    marginTop: Spacing.xs,
    fontWeight: "400" as const,
  },
  helperText: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    marginTop: Spacing.xs,
    fontWeight: "400" as const,
  },
});
