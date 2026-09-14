/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", ["ui", "core", "web", "mobile", "docs", "root"]],
    "scope-empty": [2, "never"],
    "header-max-length": [2, "always", 72],
  },
};
