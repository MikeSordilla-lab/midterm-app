/**
 * Rating Badge Component
 * Displays performance ratings with color-coded indicators
 * Supports letter grades and numeric range displays
 */

import React from "react";
import { View, Text, ViewStyle } from "react-native";
import { Spacing, BorderRadius } from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

type RatingLevel = "excellent" | "good" | "fair" | "poor" | "no-rating";
type DisplayFormat = "letter" | "numeric" | "label";

interface RatingBadgeProps {
  rating: number | null; // 0-100 or null
  format?: DisplayFormat;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

const getRatingLevel = (score: number | null): RatingLevel => {
  if (score === null) return "no-rating";
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  return "poor";
};

const getRatingConfig = (level: RatingLevel, isDarkMode: boolean) => {
  const lightConfig = {
    excellent: {
      backgroundColor: "#d1fae5",
      textColor: "#065f46",
      label: "Excellent",
      letter: "A",
    },
    good: {
      backgroundColor: "#dbeafe",
      textColor: "#0c4a6e",
      label: "Good",
      letter: "B",
    },
    fair: {
      backgroundColor: "#fef3c7",
      textColor: "#78350f",
      label: "Fair",
      letter: "C",
    },
    poor: {
      backgroundColor: "#fee2e2",
      textColor: "#7f1d1d",
      label: "Poor",
      letter: "F",
    },
    "no-rating": {
      backgroundColor: "#f3f4f6",
      textColor: "#6b7280",
      label: "No Rating",
      letter: "-",
    },
  };

  const darkConfig = {
    excellent: {
      backgroundColor: "#064e3b",
      textColor: "#86efac",
      label: "Excellent",
      letter: "A",
    },
    good: {
      backgroundColor: "#082f49",
      textColor: "#38bdf8",
      label: "Good",
      letter: "B",
    },
    fair: {
      backgroundColor: "#78350f",
      textColor: "#fcd34d",
      label: "Fair",
      letter: "C",
    },
    poor: {
      backgroundColor: "#7f1d1d",
      textColor: "#fca5a5",
      label: "Poor",
      letter: "F",
    },
    "no-rating": {
      backgroundColor: "#374151",
      textColor: "#d1d5db",
      label: "No Rating",
      letter: "-",
    },
  };

  const config = isDarkMode ? darkConfig : lightConfig;
  return config[level];
};

const getSizeConfig = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        fontSize: 12,
      };
    case "md":
      return {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        fontSize: 14,
      };
    case "lg":
      return {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        fontSize: 16,
      };
  }
};

const getDisplayText = (
  rating: number | null,
  format: DisplayFormat,
  level: RatingLevel,
  ratingConfig: ReturnType<typeof getRatingConfig>,
): string => {
  switch (format) {
    case "letter":
      return ratingConfig.letter;
    case "numeric":
      return rating !== null ? `${rating}%` : "-";
    case "label":
    default:
      if (rating !== null && rating >= 0) {
        return `${ratingConfig.label} (${rating}%)`;
      }
      return ratingConfig.label;
  }
};

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  format = "label",
  size = "md",
  style,
}) => {
  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb";

  const level = getRatingLevel(rating);
  const ratingConfig = getRatingConfig(level, isDarkMode);
  const sizeConfig = getSizeConfig(size);
  const displayText = getDisplayText(rating, format, level, ratingConfig);

  return (
    <View
      style={[
        {
          paddingHorizontal: sizeConfig.paddingHorizontal,
          paddingVertical: sizeConfig.paddingVertical,
          borderRadius: BorderRadius.md,
          backgroundColor: ratingConfig.backgroundColor,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: sizeConfig.fontSize,
          fontWeight: "600",
          color: ratingConfig.textColor,
        }}
      >
        {displayText}
      </Text>
    </View>
  );
};
