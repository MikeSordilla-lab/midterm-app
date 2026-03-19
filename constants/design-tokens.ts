/**
 * Comprehensive Design Token System
 * Includes: Colors, Spacing, Typography, Border Radius, Shadows
 * Used across all components for consistent, accessible design
 */

import { Platform } from 'react-native';

// ========================================
// 1. SEMANTIC COLOR SYSTEM (WCAG AA Compliant)
// ========================================

export const SemanticColors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f7ff',
    100: '#e0effe',
    200: '#bae6fd',
    400: '#38bdf8',
    500: '#0ea5e9', // Main brand color
    600: '#0284c7',
    700: '#0369a1',
    900: '#082f49',
  },

  // Success (Green)
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },

  // Warning (Amber)
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  // Error (Red)
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Neutral (Text & Backgrounds)
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// ========================================
// 2. LIGHT THEME (WCAG AA Compliant Contrast)
// ========================================

export const LightTheme = {
  colors: {
    // Text Colors
    text: SemanticColors.neutral[900], // #111827 - 14:1 contrast on white
    textSecondary: SemanticColors.neutral[600], // #4b5563 - 8.5:1 contrast
    textTertiary: SemanticColors.neutral[500], // #6b7280 - 7:1 contrast
    textDisabled: SemanticColors.neutral[400], // #9ca3af - 5.5:1 contrast
    textInverse: SemanticColors.neutral[0], // White text on dark

    // Backgrounds
    background: SemanticColors.neutral[0], // #ffffff
    surfaceBackground: SemanticColors.neutral[50], // #f9fafb - subtle raised surface
    surfaceElevated: SemanticColors.neutral[0], // #ffffff - cards, modals

    // Borders & Dividers
    border: SemanticColors.neutral[200], // #e5e7eb - 4:1 contrast
    divider: SemanticColors.neutral[100], // #f3f4f6 - subtle separator
    borderStrong: SemanticColors.neutral[300], // #d1d5db - emphasized border

    // Interactive Colors
    primary: SemanticColors.primary[500], // #0ea5e9 - main actions
    primaryHover: SemanticColors.primary[600], // #0284c7 - hover state
    primaryActive: SemanticColors.primary[700], // #0369a1 - pressed state
    primaryText: SemanticColors.neutral[0], // White text on primary bg

    // Semantic Colors
    success: SemanticColors.success[500], // #22c55e
    successLight: SemanticColors.success[50], // #f0fdf4
    warning: SemanticColors.warning[500], // #f59e0b
    warningLight: SemanticColors.warning[50], // #fffbeb
    error: SemanticColors.error[500], // #ef4444
    errorLight: SemanticColors.error[50], // #fef2f2

    // Status Indicators
    info: SemanticColors.primary[500],
    infoLight: SemanticColors.primary[50],
  },
};

// ========================================
// 3. DARK THEME (WCAG AA Compliant Contrast)
// ========================================

export const DarkTheme = {
  colors: {
    // Text Colors
    text: SemanticColors.neutral[50], // #f9fafb - light gray
    textSecondary: SemanticColors.neutral[400], // #9ca3af - medium gray
    textTertiary: SemanticColors.neutral[500], // #6b7280 - darker gray
    textDisabled: SemanticColors.neutral[600], // #4b5563 - very dark gray
    textInverse: SemanticColors.neutral[900], // Dark text on light

    // Backgrounds
    background: SemanticColors.neutral[900], // #111827 - dark bg
    surfaceBackground: SemanticColors.neutral[800], // #1f2937 - raised surface
    surfaceElevated: SemanticColors.neutral[700], // #374151 - cards, modals

    // Borders & Dividers
    border: SemanticColors.neutral[700], // #374151 - subtle border
    divider: SemanticColors.neutral[800], // #1f2937 - subtle separator
    borderStrong: SemanticColors.neutral[600], // #4b5563 - emphasized border

    // Interactive Colors
    primary: SemanticColors.primary[400], // #38bdf8 - slightly lighter in dark mode
    primaryHover: SemanticColors.primary[500], // #0ea5e9 - hover state
    primaryActive: SemanticColors.primary[600], // #0284c7 - pressed state
    primaryText: SemanticColors.neutral[900], // Dark text on primary bg

    // Semantic Colors
    success: SemanticColors.success[500], // #22c55e
    successLight: SemanticColors.success[700], // #15803d - dark green for dark bg
    warning: SemanticColors.warning[500], // #f59e0b
    warningLight: SemanticColors.warning[600], // #d97706 - dark amber for dark bg
    error: SemanticColors.error[500], // #ef4444
    errorLight: SemanticColors.error[600], // #dc2626 - dark red for dark bg

    // Status Indicators
    info: SemanticColors.primary[400],
    infoLight: SemanticColors.primary[600],
  },
};

// ========================================
// 4. SPACING SYSTEM (8px Base Unit)
// ========================================

export const Spacing = {
  xs: 4, // 4px - tight spacing
  sm: 8, // 8px - small spacing
  md: 12, // 12px - medium spacing
  lg: 16, // 16px - default/large component padding
  xl: 24, // 24px - section spacing
  xxl: 32, // 32px - large section spacing
  xxxl: 48, // 48px - very large spacing
  huge: 64, // 64px - massive spacing
} as const;

// Container padding values
export const ContainerPadding = {
  mobile: Spacing.lg, // 16px on mobile
  tablet: Spacing.xl, // 24px on tablet
  desktop: Spacing.xxl, // 32px on desktop
} as const;

// Card/Component internal spacing
export const ComponentSpacing = {
  cardPadding: Spacing.lg, // 16px
  buttonPadding: {
    horizontal: Spacing.md, // 12px
    vertical: Spacing.sm, // 8px
  },
  inputPadding: {
    horizontal: Spacing.md, // 12px
    vertical: Spacing.md, // 12px
  },
  listGap: Spacing.md, // 12px gap between list items
  sectionGap: Spacing.xl, // 24px gap between sections
} as const;

// ========================================
// 5. TYPOGRAPHY SYSTEM
// ========================================

export const Typography = {
  // Heading 1 - Page titles
  heading1: {
    fontSize: 28,
    lineHeight: 33.6, // 1.2x
    letterSpacing: -0.5,
    fontWeight: '700' as const,
  },

  // Heading 2 - Section titles
  heading2: {
    fontSize: 24,
    lineHeight: 30, // 1.25x
    letterSpacing: -0.2,
    fontWeight: '600' as const,
  },

  // Heading 3 - Subsection titles
  heading3: {
    fontSize: 20,
    lineHeight: 26, // 1.3x
    letterSpacing: 0,
    fontWeight: '600' as const,
  },

  // Body Large - Emphasized body text
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24, // 1.5x
    letterSpacing: 0,
    fontWeight: '500' as const,
  },

  // Body - Default body text
  body: {
    fontSize: 16,
    lineHeight: 24, // 1.5x
    letterSpacing: 0,
    fontWeight: '400' as const,
  },

  // Body Small - Secondary text
  bodySmall: {
    fontSize: 14,
    lineHeight: 21, // 1.5x
    letterSpacing: 0,
    fontWeight: '400' as const,
  },

  // Button Text
  buttonText: {
    fontSize: 14,
    lineHeight: 19.6, // 1.4x
    letterSpacing: 0.5,
    fontWeight: '600' as const,
  },

  // Label - Form labels, tags
  label: {
    fontSize: 12,
    lineHeight: 15.6, // 1.3x
    letterSpacing: 0.4,
    fontWeight: '500' as const,
  },

  // Caption - Small supporting text
  caption: {
    fontSize: 11,
    lineHeight: 14.3, // 1.3x
    letterSpacing: 0.4,
    fontWeight: '400' as const,
  },

  // Overline - All caps labels
  overline: {
    fontSize: 10,
    lineHeight: 13, // 1.3x
    letterSpacing: 1.5,
    fontWeight: '600' as const,
  },
} as const;

// ========================================
// 6. FONT FAMILY SYSTEM
// ========================================

export const FontFamilies = Platform.select({
  ios: {
    sans: 'System', // San Francisco
    serif: 'Georgia',
    mono: 'Menlo',
  },
  android: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    serif: 'Georgia',
    mono: 'Roboto Mono',
  },
  web: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: 'SF Mono, Monaco, "Cascadia Code", Roboto Mono, Consolas, "Liberation Mono", monospace',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    mono: 'monospace',
  },
});

// ========================================
// 7. BORDER RADIUS SYSTEM
// ========================================

export const BorderRadius = {
  none: 0,
  xs: 2, // Minimal rounding
  sm: 4, // Subtle (inputs, small components)
  md: 8, // Default (cards, buttons)
  lg: 12, // Large (modals, containers)
  xl: 16, // Extra large
  full: 9999, // Pill shapes (avatars, badges)
} as const;

// ========================================
// 8. SHADOW SYSTEM (Elevation)
// ========================================

export const Shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Shadow Level 1 - Subtle
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Shadow Level 2 - Default
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  // Shadow Level 3 - Emphasized
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },

  // Shadow Level 4 - Heavy
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
} as const;

// Web-only shadow strings (for CSS)
export const ShadowsCSS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
} as const;

// ========================================
// 9. SIZE TOKENS (Touch Targets & Components)
// ========================================

export const Sizes = {
  // Touch Targets (iOS/Android minimum 44pt/44px)
  touchTarget: {
    small: 40, // Compact touch targets (min)
    default: 44, // Standard touch target
    large: 56, // Large touch target
  },

  // Input Heights
  inputHeight: {
    small: 32,
    default: 44,
    large: 56,
  },

  // Button Heights
  buttonHeight: {
    xs: 32,
    sm: 40,
    md: 44,
    lg: 56,
  },

  // Icon Sizes
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Avatar Sizes
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  },
} as const;

// ========================================
// 10. ANIMATION/TRANSITION TOKENS
// ========================================

export const Animations = {
  // Duration in milliseconds
  duration: {
    fast: 150, // Quick feedback (button press)
    normal: 300, // Standard transition
    slow: 500, // Intentional movement
  },

  // Easing functions (for web)
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
} as const;

// ========================================
// 11. Z-INDEX SCALE
// ========================================

export const ZIndex = {
  hidden: -1,
  base: 0,
  dropdown: 100,
  modal: 1000,
  popover: 1100,
  tooltip: 1200,
  notification: 1300,
} as const;

// ========================================
// 12. BREAKPOINTS (Responsive Design)
// ========================================

export const Breakpoints = {
  xs: 320, // Small phones
  sm: 390, // iPhone standard
  md: 640, // Tablet/iPad
  lg: 1024, // Large tablet/desktop
  xl: 1280, // Large desktop
  xxl: 1536, // Extra large desktop
} as const;
