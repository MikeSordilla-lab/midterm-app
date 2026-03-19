/**
 * Badge Component
 * Used for status indicators and labels
 */

import React from "react";
import { StyleSheet, Text, View, ViewStyle, Platform } from "react-native";
import {
  Spacing,
  BorderRadius,
  Typography,
  LightTheme,
  DarkTheme,
} from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

type BadgeVariant = "primary" | "success" | "warning" | "error" | "neutral";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const getVariantColors = (
  variant: BadgeVariant,
  isDarkMode: boolean,
  themeColors: typeof LightTheme.colors,
) => {
  const colorMap = {
    primary: {
      bg: isDarkMode ? themeColors.primary : themeColors.primary,
      text: isDarkMode ? themeColors.textInverse : themeColors.primaryText,
      border: isDarkMode ? themeColors.primary : themeColors.primary,
    },
    success: {
      bg: isDarkMode ? themeColors.success : themeColors.successLight,
      text: isDarkMode ? themeColors.success : themeColors.success,
      border: isDarkMode ? themeColors.success : themeColors.success,
    },
    warning: {
      bg: isDarkMode ? themeColors.warning : themeColors.warningLight,
      text: isDarkMode ? themeColors.warning : themeColors.warning,
      border: isDarkMode ? themeColors.warning : themeColors.warning,
    },
    error: {
      bg: isDarkMode ? themeColors.error : themeColors.errorLight,
      text: isDarkMode ? themeColors.error : themeColors.error,
      border: isDarkMode ? themeColors.error : themeColors.error,
    },
    neutral: {
      bg: themeColors.surfaceBackground,
      text: themeColors.textSecondary,
      border: themeColors.border,
    },
  };

  return colorMap[variant];
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "md",
  icon,
  style,
}) => {
  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb"; // Light text = dark mode

  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;
  const variantColors = getVariantColors(variant, isDarkMode, themeColors);

  const sizeConfig = {
    sm: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      fontSize: Typography.caption.fontSize,
    },
    md: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: Typography.label.fontSize,
    },
    lg: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: Typography.bodySmall.fontSize,
    },
  };

  const config = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: config.paddingHorizontal,
          paddingVertical: config.paddingVertical,
          backgroundColor: variantColors.bg,
          borderColor: variantColors.border,
        },
        style,
      ]}
    >
      {icon && <View style={{ marginRight: Spacing.xs }}>{icon}</View>}
      <Text
        style={{
          fontSize: config.fontSize,
          fontWeight: "500" as const,
          color: variantColors.text,
          fontFamily: Platform.select({
            ios: "System",
            android: "-apple-system",
            web: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            default: "sans-serif",
          }),
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
});
