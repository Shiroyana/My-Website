import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Pages link with plain <a> on purpose: full page loads let the Taste kit scripts
      // (public/assets) start fresh on every page. See src/components/TasteRuntime.tsx.
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/assets/**",
      ".claude/**",
      ".agents/**",
      ".taste-skill/**",
      "next-env.d.ts",
    ],
  },
];

export default config;
