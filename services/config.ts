/**
 * API Configuration for different environments
 * 
 * When running on Expo (mobile/emulator), 'localhost' refers to the device itself.
 * You need to provide your PC's actual IP address.
 * 
 * HOW TO FIND YOUR IP:
 * 1. Windows: Open Command Prompt (cmd)
 * 2. Type: ipconfig
 * 3. Look for "IPv4 Address" (usually 192.168.x.x or 10.0.x.x)
 * 4. Update API_IP below with that IP (keep port 80 and path /midterm-api/api)
 * 
 * SPECIAL CASES:
 * - Android Emulator on same PC: Use 10.0.2.2 (special alias for host machine)
 * - iOS Simulator on same Mac: Use 127.0.0.1 or your Mac's IP
 * - Physical device on same WiFi: Use your PC's actual IP (192.168.x.x)
 * - Web browser on same PC: Use localhost
 */

// ============= CONFIGURATION =============
// Update this to your PC's actual IP address if needed
// For Android emulator: 10.0.2.2
// For real device or iOS: your PC's IPv4 address (find with: ipconfig)
export const API_IP = process.env.EXPO_PUBLIC_API_IP || '192.168.0.78';
export const API_PORT = 80;
export const API_PATH = '/midterm-api/api';

// Detect environment - improved detection for React Native vs Web
function isReactNativeEnvironment(): boolean {
  // Check for React Native specific globals
  if (typeof global !== 'undefined' && global.__DEV__ !== undefined) {
    // React Native environment
    return true;
  }
  
  // Check for navigator userAgent which differs between web and RN
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent;
    // React Native user agents typically contain these
    if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
      // Could be either web mobile or RN, need more checks
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'http:') {
        // Has proper window.location, likely web browser
        return false;
      }
      return true;
    }
  }
  
  // If no window object or no window.location, likely React Native
  if (typeof window === 'undefined' || !window.location) {
    return true;
  }
  
  return false;
}

const isNative = isReactNativeEnvironment();
const isWeb = !isNative;

/**
 * Get the appropriate base URL for the current environment
 */
export function getBaseURL(): string {
  if (isWeb) {
    // Web environment - use localhost
    return `http://localhost${API_PATH}`;
  } else {
    // Native environment (Expo mobile/emulator)
    return `http://${API_IP}:${API_PORT}${API_PATH}`;
  }
}

/**
 * Check if running in native (React Native) environment
 */
export function isNativeEnvironment(): boolean {
  return isNative;
}

/**
 * Get debug info about the environment
 */
export function getEnvironmentInfo() {
  return {
    isWeb,
    isNative,
    baseURL: getBaseURL(),
    apiIP: API_IP,
    apiPort: API_PORT,
    apiPath: API_PATH,
  };
}
