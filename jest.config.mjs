export default {
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    prettierPath: null,
    setupFilesAfterEnv: ['./jest-setup.ts'],
    testEnvironment: 'jsdom',
    testMatch: ['**/*.(spec|test).(ts|tsx|?js)'],
    transform: {
        '^.+\\.(t|j)sx?$': [
            '@swc/jest',
            {
                jsc: {
                    transform: {
                        react: {
                            runtime: 'automatic',
                        },
                    },
                },
                module: {
                    type: 'commonjs',
                },
                sourceMaps: true,
            },
        ],
    },
}
