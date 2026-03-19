import { StyleSheet, Text, type TextProps, Platform } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Typography, LightTheme, DarkTheme } from "@/constants/design-tokens";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "h1"
    | "h2"
    | "h3"
    | "bodyLarge"
    | "body"
    | "bodySmall"
    | "button"
    | "label"
    | "caption"
    // Legacy support
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "body",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        {
          color,
          fontFamily: Platform.select({
            ios: "System",
            android: "-apple-system, BlinkMacSystemFont",
            web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            default: "sans-serif",
          }),
        },
        // New typography system
        type === "h1" ? styles.h1 : undefined,
        type === "h2" ? styles.h2 : undefined,
        type === "h3" ? styles.h3 : undefined,
        type === "bodyLarge" ? styles.bodyLarge : undefined,
        type === "body" ? styles.body : undefined,
        type === "bodySmall" ? styles.bodySmall : undefined,
        type === "button" ? styles.button : undefined,
        type === "label" ? styles.label : undefined,
        type === "caption" ? styles.caption : undefined,
        // Legacy support
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // ===== New Design System =====
  h1: {
    fontSize: Typography.heading1.fontSize,
    lineHeight: Typography.heading1.lineHeight,
    fontWeight: "700" as const,
    letterSpacing: Typography.heading1.letterSpacing,
  },
  h2: {
    fontSize: Typography.heading2.fontSize,
    lineHeight: Typography.heading2.lineHeight,
    fontWeight: "600" as const,
    letterSpacing: Typography.heading2.letterSpacing,
  },
  h3: {
    fontSize: Typography.heading3.fontSize,
    lineHeight: Typography.heading3.lineHeight,
    fontWeight: "600" as const,
    letterSpacing: Typography.heading3.letterSpacing,
  },
  bodyLarge: {
    fontSize: Typography.bodyLarge.fontSize,
    lineHeight: Typography.bodyLarge.lineHeight,
    fontWeight: "500" as const,
    letterSpacing: Typography.bodyLarge.letterSpacing,
  },
  body: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: "400" as const,
    letterSpacing: Typography.body.letterSpacing,
  },
  bodySmall: {
    fontSize: Typography.bodySmall.fontSize,
    lineHeight: Typography.bodySmall.lineHeight,
    fontWeight: "400" as const,
    letterSpacing: Typography.bodySmall.letterSpacing,
  },
  button: {
    fontSize: Typography.buttonText.fontSize,
    lineHeight: Typography.buttonText.lineHeight,
    fontWeight: "600" as const,
    letterSpacing: Typography.buttonText.letterSpacing,
  },
  label: {
    fontSize: Typography.label.fontSize,
    lineHeight: Typography.label.lineHeight,
    fontWeight: "500" as const,
    letterSpacing: Typography.label.letterSpacing,
  },
  caption: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    fontWeight: "400" as const,
    letterSpacing: Typography.caption.letterSpacing,
  },

  // ===== Legacy Support =====
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
