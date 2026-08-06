import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^next-auth/jwt$": "<rootDir>/src/test-utils/mocks/next-auth-jwt.ts",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.ts?(x)",
    "<rootDir>/src/app/api/**/__tests__/**/*.test.ts",
  ],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
}

export default config
