/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/"]
};
