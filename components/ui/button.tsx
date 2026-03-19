/**
 * Enhanced Button Component
 * Supports multiple variants, sizes, and states
 * Touch target: 44px minimum on mobile
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import {
  Spacing,
  Sizes,
  BorderRadius,
  Typography,
  LightTheme,
  DarkTheme,
} from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface EnhancedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const getButtonStyles = (
  variant: ButtonVariant,
  size: ButtonSize,
  disabled: boolean,
  isDarkMode: boolean,
  themeColors: typeof LightTheme.colors,
): { container: ViewStyle; text: TextStyle } => {
  // Height by size
  const heightMap = {
    xs: Sizes.buttonHeight.xs,
    sm: Sizes.buttonHeight.sm,
    md: Sizes.buttonHeight.md,
    lg: Sizes.buttonHeight.lg,
  };

  // Padding by size
  const paddingMap = {
    xs: { horizontal: Spacing.sm, vertical: Spacing.xs },
    sm: { horizontal: Spacing.md, vertical: Spacing.sm },
    md: { horizontal: Spacing.lg, vertical: Spacing.md },
    lg: { horizontal: Spacing.lg, vertical: Spacing.md },
  };

  const padding = paddingMap[size];
  const height = heightMap[size];

  // Base container styles
  let containerStyle: ViewStyle = {
    height,
    paddingHorizontal: padding.horizontal,
    paddingVertical: padding.vertical,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  };

  let textStyle: TextStyle = {
    ...Typography.buttonText,
    textAlign: "center",
  };

  // Variant styles
  switch (variant) {
    case "primary":
      containerStyle = {
        ...containerStyle,
        backgroundColor: disabled
          ? themeColors.textDisabled
          : themeColors.primary,
      };
      textStyle = {
        ...textStyle,
        color: themeColors.primaryText,
        fontWeight: "600",
      };
      break;

    case "secondary":
      containerStyle = {
        ...containerStyle,
        backgroundColor: themeColors.surfaceBackground,
        borderWidth: 1,
        borderColor: themeColors.border,
      };
      textStyle = {
        ...textStyle,
        color: themeColors.text,
      };
      break;

    case "outline":
      containerStyle = {
        ...containerStyle,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: disabled ? themeColors.textDisabled : themeColors.primary,
      };
      textStyle = {
        ...textStyle,
        color: disabled ? themeColors.textDisabled : themeColors.primary,
        fontWeight: "600",
      };
      break;

    case "ghost":
      containerStyle = {
        ...containerStyle,
        backgroundColor: "transparent",
      };
      textStyle = {
        ...textStyle,
        color: disabled ? themeColors.textDisabled : themeColors.primary,
        fontWeight: "600",
      };
      break;

    case "danger":
      containerStyle = {
        ...containerStyle,
        backgroundColor: disabled
          ? themeColors.textDisabled
          : themeColors.error,
      };
      textStyle = {
        ...textStyle,
        color: themeColors.primaryText,
        fontWeight: "600",
      };
      break;
  }

  if (disabled) {
    containerStyle.opacity = 0.5;
  }

  return { container: containerStyle, text: textStyle };
};

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}) => {
  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb"; // Light text = dark mode

  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;
  const { container, text } = getButtonStyles(
    variant,
    size,
    disabled || loading,
    isDarkMode,
    themeColors,
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[container, fullWidth && { width: "100%" }, style]}
    >
      {loading ? (
        <ActivityIndicator color={text.color as string} size="small" />
      ) : (
        <>
          {icon && <View style={{ marginRight: Spacing.sm }}>{icon}</View>}
          <Text style={text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
