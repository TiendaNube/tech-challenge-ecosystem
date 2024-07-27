module.exports = {
    testTimeout: 30000,
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    globals: {
        SERVER_URL: 'http://localhost:3000',
    },
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    verbose: true,
}