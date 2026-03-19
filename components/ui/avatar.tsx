/**
 * Avatar Component
 * Displays user profile images with fallback to initials
 * Supports multiple sizes with optional status indicator
 */

import React from "react";
import { View, Text, Image, ViewStyle } from "react-native";
import { LightTheme, DarkTheme } from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type StatusIndicator = "online" | "offline" | "away" | "busy" | "none";

interface AvatarProps {
  initials?: string;
  imageUrl?: string;
  size?: AvatarSize;
  status?: StatusIndicator;
  backgroundColor?: string;
  style?: ViewStyle;
}

const getSizeConfig = (size: AvatarSize) => {
  switch (size) {
    case "xs":
      return { container: 32, text: 12, statusSize: 8 };
    case "sm":
      return { container: 40, text: 14, statusSize: 10 };
    case "md":
      return { container: 48, text: 16, statusSize: 12 };
    case "lg":
      return { container: 64, text: 20, statusSize: 14 };
    case "xl":
      return { container: 80, text: 24, statusSize: 16 };
  }
};

const getStatusColor = (status: StatusIndicator) => {
  switch (status) {
    case "online":
      return "#10b981"; // Green
    case "offline":
      return "#6b7280"; // Gray
    case "away":
      return "#f59e0b"; // Amber
    case "busy":
      return "#ef4444"; // Red
    case "none":
    default:
      return "transparent";
  }
};

export const Avatar: React.FC<AvatarProps> = ({
  initials = "?",
  imageUrl,
  size = "md",
  status = "none",
  backgroundColor,
  style,
}) => {
  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb";
  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;

  const sizeConfig = getSizeConfig(size);
  const statusColor = getStatusColor(status);

  const bgColor = backgroundColor || themeColors.primary;

  return (
    <View style={[{ position: "relative" }, style]}>
      <View
        style={[
          {
            width: sizeConfig.container,
            height: sizeConfig.container,
            borderRadius: sizeConfig.container / 2,
            backgroundColor: bgColor,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <Text
            style={{
              fontSize: sizeConfig.text,
              fontWeight: "600",
              color: themeColors.textInverse,
            }}
          >
            {initials.substring(0, 2).toUpperCase()}
          </Text>
        )}
      </View>

      {status !== "none" && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: sizeConfig.statusSize,
            height: sizeConfig.statusSize,
            borderRadius: sizeConfig.statusSize / 2,
            backgroundColor: statusColor,
            borderWidth: 2,
            borderColor: themeColors.background,
          }}
        />
      )}
    </View>
  );
};
