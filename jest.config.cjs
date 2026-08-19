module.exports = {
    transform: {},
    extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
    testEnvironment: "jsdom",
    noStackTrace: false,
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js"
    },
    testMatch: [
        "**/__tests__/**/*.test.js",  // Include normal test files
        "!**/*.sample.*"              // Exclude files containing ".sample."
    ]
}