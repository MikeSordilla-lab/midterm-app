import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';

// Mock the color scheme hook
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('useThemeColor Hook - Basic Tests', () => {
  describe('Returns correct colors', () => {
    it('should return light theme text color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'text')
      );
      expect(result.current).toBe(Colors.light.text);
    });

    it('should return light theme background color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'background')
      );
      expect(result.current).toBe(Colors.light.background);
    });

    it('should return light theme tint color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'tint')
      );
      expect(result.current).toBe(Colors.light.tint);
    });
  });

  describe('Custom colors', () => {
    it('should return custom color when provided', () => {
      const customColor = '#FF0000';
      const { result } = renderHook(() =>
        useThemeColor({ light: customColor }, 'text')
      );
      expect(result.current).toBe(customColor);
    });

    it('should return color as string', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'text')
      );
      expect(typeof result.current).toBe('string');
    });
  });

  describe('Color validation', () => {
    it('should return valid hex color format', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'text')
      );
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      expect(hexRegex.test(result.current as string)).toBe(true);
    });

    it('should return non-empty color value', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'background')
      );
      expect(result.current).toBeTruthy();
      expect(result.current?.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple property access', () => {
    it('should handle different color properties', () => {
      const { result: textResult } = renderHook(() =>
        useThemeColor({}, 'text')
      );

      const { result: bgResult } = renderHook(() =>
        useThemeColor({}, 'background')
      );

      expect(textResult.current).toBeDefined();
      expect(bgResult.current).toBeDefined();
      expect(textResult.current).not.toBe(bgResult.current);
    });

    it('should return consistent values for same property', () => {
      const { result: result1 } = renderHook(() =>
        useThemeColor({}, 'text')
      );

      const { result: result2 } = renderHook(() =>
        useThemeColor({}, 'text')
      );

      expect(result1.current).toBe(result2.current);
    });
  });
});
