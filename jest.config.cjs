// eslint-disable-next-line no-undef
module.exports = {
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(t|j)sx?$': [
            '@swc/jest',
            {
                jsc: {
                    experimental: {
                        plugins: [['jest_workaround', {}]],
                    },
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
