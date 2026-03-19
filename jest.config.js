module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  transform: {
    "^.+\\.ts(x)?$": "@swc/jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "services/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
