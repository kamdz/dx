export default {
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '@@': '<rootDir>/src/index'
  },
  preset: 'ts-jest',
  testEnvironment: 'node'
};
