export default {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    "!<rootDir>/node_modules/**",
    "!<rootDir>/build/**"
  ],
  coveragePathIgnorePatterns: [
    "/build/",
    "/node_modules/"
  ],
  displayName: {
    name: "DEVELOPMENT 🔥🔥 ",
    color: "green",
  },
  testEnvironment: 'node',
  transform: {
    ".+\\.ts$": "ts-jest"
  },
  testPathIgnorePatterns: ["/node_modules/"],
  testMatch: []
}