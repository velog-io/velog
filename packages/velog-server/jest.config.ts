/* eslint-disable @typescript-eslint/no-var-requires */
import { pathsToModuleNameMapper } from "ts-jest";
const compilerOptions = require("./tsconfig.json");
import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  preset: "ts-jest",
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: [".*\\.test\\.ts$"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: ["node_modules", "dist"],
  testPathIgnorePatterns: ["/node_modules/"],
  testEnvironment: "node",
  rootDir: "./",
  modulePaths: ["./"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

export default config;
