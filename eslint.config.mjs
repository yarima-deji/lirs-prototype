import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: { browser: true, node: true }
    },
    rules: {
      // your overrides, e.g. "no-console": "off"
    }
  }
]);
