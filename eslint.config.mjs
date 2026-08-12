import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import nextTs from "eslint-config-next/typescript";
import nextVitals from "eslint-config-next/core-web-vitals";

const domainFiles = ["src/domain/**/*.{ts,tsx}"];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: domainFiles,
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          basePath: import.meta.dirname,
          zones: [
            { target: "./src/domain", from: "./src/app" },
            { target: "./src/domain", from: "./src/components" },
            { target: "./src/domain", from: "./src/data" },
            { target: "./src/domain", from: "./src/features" },
            { target: "./src/domain", from: "./src/infrastructure" },
            { target: "./src/domain", from: "./src/lib" },
          ],
        },
      ],
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "Domain code must not perform I/O." },
        { name: "indexedDB", message: "Domain code must not access browser storage." },
        { name: "localStorage", message: "Domain code must not access browser storage." },
        { name: "process", message: "Inject environment values into domain functions." },
        { name: "sessionStorage", message: "Domain code must not access browser storage." },
        { name: "WebSocket", message: "Domain code must not perform I/O." },
        { name: "XMLHttpRequest", message: "Domain code must not perform I/O." },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: ["dexie", "dexie-react-hooks", "next", "react", "react-dom"],
          patterns: [
            "@/app/*",
            "@/components/*",
            "@/data/*",
            "@/features/*",
            "@/infrastructure/*",
            "@/lib/*",
            "child_process",
            "child_process/*",
            "cluster",
            "dgram",
            "dns",
            "dns/*",
            "fs",
            "fs/*",
            "http",
            "http/*",
            "https",
            "https/*",
            "net",
            "node:*",
            "next/*",
            "perf_hooks",
            "process",
            "react/*",
            "react-dom/*",
            "tls",
            "worker_threads",
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
          message: "Inject time into domain functions instead of calling Date.now().",
        },
        {
          selector: "CallExpression[callee.object.name='Math'][callee.property.name='random']",
          message: "Domain functions must be deterministic and must not call Math.random().",
        },
        {
          selector: "CallExpression[callee.object.name='globalThis'][callee.property.name='fetch']",
          message: "Domain code must not perform I/O through globalThis.fetch().",
        },
        {
          selector:
            "CallExpression[callee.object.name='globalThis'][callee.computed=true][callee.property.value='fetch']",
          message: "Domain code must not perform I/O through globalThis.fetch().",
        },
        {
          selector: "CallExpression[callee.object.name='window'][callee.property.name='fetch']",
          message: "Domain code must not perform I/O through window.fetch().",
        },
        {
          selector: "NewExpression[callee.name='Date']",
          message: "Inject time into domain functions instead of constructing Date values.",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "build/**",
    "coverage/**",
    "data/generated/**",
    "harness/.next/**",
    "harness/out/**",
    "node_modules/**",
    "out/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
