module.exports = {
    transform: {},
    extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
    testEnvironment: "jsdom",
    noStackTrace: true,
    testMatch: [
        "**/__tests__/**/*.test.js",  // Include normal test files
        "!**/*.sample.*"              // Exclude files containing ".sample."
    ]
}