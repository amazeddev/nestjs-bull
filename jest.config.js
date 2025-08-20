module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: {
          paths: {
            '@categories/*': ['categories/*'],
            '@meals/*': ['meals/*'],
            '@orders/*': ['orders/*'],
            '@config/*': ['config/*'],
          },
        },
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapping: {
    '@common': '<rootDir>/common',
    '@categories': '<rootDir>/categories',
    '@meals': '<rootDir>/meals',
    '@orders': '<rootDir>/orders',
    '@config': '<rootDir>/config',
  },
};
