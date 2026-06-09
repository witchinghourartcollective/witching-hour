import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "**/.next/**",
    ".open-next/**",
    "**/.open-next/**",
    "node_modules/**",
    "**/node_modules/**",
    "out/**",
    "build/**",
    "dist/**",
    "next-env.d.ts",
    "Witching Hour Music/**",
    "witching hour/**",
    "anchor/**",
    "my-tac-project/**",
    "witching-hour-app/**",
  ]),
]);

export default eslintConfig;
