module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['<rootDir>/tests/globals/globals.test.js'],
  testPathIgnorePatterns: ['<rootDir>/tests/globals/globals.test.js'],
};
