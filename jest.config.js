/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testMatch: ['**/*.test.ts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
