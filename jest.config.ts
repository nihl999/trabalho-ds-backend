import type { Config } from 'jest'

const config: Config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    roots: ['src'],
    moduleDirectories: ['node_modules', 'src'],
    modulePaths: ['node_modules', '<rootDir>/src'],
    testRegex: '.*\\.spec\\.ts$',
    transform: { '^.+\\.(t|j)s$': 'ts-jest' },
    collectCoverageFrom: [
        './src/**/*.(t|j)s',
        './shared/**/*.(t|j)s',
        '!./src/modules/**/application/index.ts',
        '!**/*.module.ts',
        '!**/*.command.ts',
        '!**/*.event.ts',
        '!./src/shared/infra/migrations/**',
        '!**/*.model.ts',
        '!./src/index.ts',
        '!./src/main.ts',
    ],
    coverageDirectory: './test/coverage',
    testEnvironment: 'node',
    restoreMocks: true,
}

export default config
