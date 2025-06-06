import globals from "globals";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import eslintPluginVue from "eslint-plugin-vue";
// import nuxtPlugin from '@nuxtjs/eslint-plugin'; // Keep commented for now

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
    },
  },
  // { // If Nuxt plugin is needed and installed later
  //   files: ['**/*.vue'], // Or specific files needing Nuxt rules
  //   plugins: {
  //     nuxt: nuxtPlugin,
  //   },
  //   rules: {
  //     ...nuxtPlugin.configs.recommended.rules,
  //   },
  // }
];
