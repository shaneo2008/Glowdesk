import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default [
  ...coreWebVitals,
  ...nextTypeScript,
  {
    ignores: [".next/**", "node_modules/**"],
  },
];
