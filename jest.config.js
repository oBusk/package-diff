module.exports = {
    collectCoverageFrom: ["**/*.[jt]sx?$", "!**/*.d.ts", "!**/node_modules/**"],
    moduleDirectories: ["node_modules", "src"],
    moduleNameMapper: {
        // Handle CSS imports (with CSS modules)
        // https://jestjs.io/docs/webpack#mocking-css-modules
        "^.+\\.module\\.(c|sa|sc)ss$": "identity-obj-proxy",

        // Handle CSS imports (without CSS modules)
        "^.+\\.(c|sa|sc)ss$": "<rootDir>/__mocks__/styleMock.js",

        // Handle image imports
        // https://jestjs.io/docs/webpack#handling-static-assets
        "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
    transformIgnorePatterns: ["/node_modules/", "^.+\\.module\\.(c|sa|sc)ss$"],
};
