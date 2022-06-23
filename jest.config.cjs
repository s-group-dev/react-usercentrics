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
                sourceMaps: true,
            },
        ],
    },
}
