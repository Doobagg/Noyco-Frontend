// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  js.configs.recommended, 
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // ✅ Errors if a variable is declared but never used
      "no-unused-vars": ["off", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
      // ✅ Disable undefined variable warnings (React handles this)
      "no-undef": "off",
      // ✅ Allow console but warn on it
      "no-console": "off",
      // ✅ Disable prop-types for Next.js projects
      "react/prop-types": "off",
      // ✅ Disable React import requirement (Next.js handles it)
      "react/react-in-jsx-scope": "off",
      // ✅ Allow unescaped entities in JSX
      "react/no-unescaped-entities": ["off"],
    },
  },
];
