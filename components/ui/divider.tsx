/**
 * Divider Component
 * Subtle separators between content sections
 */

import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Spacing, LightTheme, DarkTheme } from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

interface DividerProps {
  style?: ViewStyle;
  vertical?: boolean;
  thickness?: "thin" | "normal" | "thick";
  margin?: "none" | "sm" | "md" | "lg";
}

export const Divider: React.FC<DividerProps> = ({
  style,
  vertical = false,
  thickness = "normal",
  margin = "md",
}) => {
  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb"; // Light text = dark mode

  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;

  const thicknessMap = {
    thin: 0.5,
    normal: 1,
    thick: 2,
  };

  const marginMap = {
    none: 0,
    sm: Spacing.sm,
    md: Spacing.md,
    lg: Spacing.lg,
  };

  const size = thicknessMap[thickness];
  const spacing = marginMap[margin];

  if (vertical) {
    return (
      <View
        style={[
          styles.dividerVertical,
          {
            width: size,
            marginHorizontal: spacing,
            backgroundColor: themeColors.divider,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.dividerHorizontal,
        {
          height: size,
          marginVertical: spacing,
          backgroundColor: themeColors.divider,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dividerHorizontal: {
    width: "100%",
  },
  dividerVertical: {
    height: "100%",
  },
});
