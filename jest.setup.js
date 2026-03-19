// Jest setup file - minimal configuration for testing

// Mock React Native completely
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: "ios",
    select: (obj) => obj.ios || obj.default,
  },
  ActivityIndicator: () => null,
  TouchableOpacity: (props) => props.children,
  View: (props) => props.children,
  Modal: (props) => props.children,
  ScrollView: (props) => props.children,
  SafeAreaView: (props) => props.children,
  Text: (props) => props.children,
  TextInput: () => null,
  StyleSheet: {
    create: (styles) => styles,
  },
  useColorScheme: () => "light",
}));

// Mock expo modules
jest.mock("expo-constants", () => ({
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
}));
