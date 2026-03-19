/**
 * Skeleton Loader Component
 * Animated placeholder for loading states
 * Matches StudentCard dimensions with shimmer effect
 */

import React, { useEffect } from "react";
import { View, Animated, ViewStyle } from "react-native";
import { Spacing, BorderRadius } from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  variant?: "text" | "avatar" | "card" | "line";
  style?: ViewStyle;
  animated?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 20,
  variant = "line",
  style,
  animated = true,
}) => {
  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb";

  // Animated loading shimmer
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    }
  }, [animated, shimmerAnim]);

  const opacityAnimation = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0.8],
    }),
  };

  const getVariantStyles = (): ViewStyle => {
    const normalizedWidth = typeof width === "number" ? width : "100%";

    switch (variant) {
      case "avatar":
        return {
          width: height,
          height: height,
          borderRadius: height / 2,
        };
      case "text":
      case "line":
        return {
          width: normalizedWidth,
          height,
          borderRadius: BorderRadius.sm,
        };
      case "card":
        return {
          width: normalizedWidth,
          height: height || 200,
          borderRadius: BorderRadius.lg,
        };
      default:
        return {
          width: normalizedWidth,
          height,
          borderRadius: BorderRadius.sm,
        };
    }
  };

  const backgroundColor = isDarkMode
    ? "#2d3748" // Dark gray for dark mode
    : "#e5e7eb"; // Light gray for light mode

  return (
    <Animated.View
      style={[
        {
          backgroundColor,
          ...getVariantStyles(),
        },
        animated && opacityAnimation,
        style,
      ]}
    />
  );
};

/**
 * StudentCard Skeleton - Full card loading placeholder
 */
export const StudentCardSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => {
  const textColor = useThemeColor({}, "text");

  return (
    <View
      style={[
        {
          padding: Spacing.md,
          marginVertical: Spacing.sm,
          borderRadius: BorderRadius.lg,
          backgroundColor: textColor === "#f9fafb" ? "#1f2937" : "#ffffff",
        },
        style,
      ]}
    >
      {/* Header section */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: Spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.md,
          }}
        >
          {/* Avatar skeleton */}
          <SkeletonLoader variant="avatar" height={48} />
          {/* Name and email skeletons */}
          <View style={{ gap: Spacing.sm, flex: 1 }}>
            <SkeletonLoader height={16} width="80%" />
            <SkeletonLoader height={12} width="60%" />
          </View>
        </View>
        {/* Rating badge skeleton */}
        <SkeletonLoader height={20} width={80} />
      </View>

      {/* Divider */}
      <SkeletonLoader height={1} width="100%" />

      {/* Content section */}
      <View style={{ marginVertical: Spacing.md, gap: Spacing.sm }}>
        <SkeletonLoader height={16} width="100%" />
        <SkeletonLoader height={16} width="90%" />
        <SkeletonLoader height={16} width="70%" />
      </View>

      {/* Action buttons skeleton */}
      <View
        style={{
          flexDirection: "row",
          gap: Spacing.sm,
          marginTop: Spacing.md,
        }}
      >
        <SkeletonLoader height={40} width="48%" />
        <SkeletonLoader height={40} width="48%" />
      </View>
    </View>
  );
};

/**
 * List of StudentCard Skeletons
 */
export const StudentListSkeleton: React.FC<{
  count?: number;
  style?: ViewStyle;
}> = ({ count = 3, style }) => {
  return (
    <View style={style}>
      {[...Array(count)].map((_, index) => (
        <StudentCardSkeleton key={index} />
      ))}
    </View>
  );
};
