import globals from "globals";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import eslintPluginVue from "eslint-plugin-vue";
import eslintPluginNuxt from "eslint-plugin-nuxt"; // Import the new Nuxt ESLint plugin

export default [
  {
    ignores: [
      ".nuxt/**",
      ".output/**",
      "node_modules/**",
      "dist/**", // Common build output directory
    ],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  ...eslintPluginNuxt.configs['flat/recommended'], // Add Nuxt recommended flat config
  {
    files: ["**/*.vue", "**/*.ts", "**/*.js", "**/*.mjs"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: "module",
        ecmaVersion: "latest",
        extraFileExtensions: [".vue"],
        project: "./tsconfig.json", // Point to your tsconfig for type-aware linting
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // Add any other global environments if needed (e.g., jest, mocha)
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      // Example: Disable a typescript-eslint rule if needed
      // '@typescript-eslint/no-explicit-any': 'off',

      // You can override or add Nuxt specific rules here if needed
      // For example, if 'flat/recommended' is too strict or not strict enough for some rules.
    },
  },
  // Removed old commented out Nuxt plugin section
];
