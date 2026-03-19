import { View, type ViewProps, Platform } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Spacing } from "@/constants/design-tokens";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  padded?: boolean;
  paddingSize?: "sm" | "md" | "lg" | "xl";
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  padded = false,
  paddingSize = "md",
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  const paddingSizeMap = {
    sm: Spacing.sm,
    md: Spacing.md,
    lg: Spacing.lg,
    xl: Spacing.xl,
  };

  return (
    <View
      style={[
        { backgroundColor },
        padded && { padding: paddingSizeMap[paddingSize] },
        style,
      ]}
      {...otherProps}
    />
  );
}
