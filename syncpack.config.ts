import type { RcFile } from "syncpack";

const config: RcFile = {
  source: ["package.json", "packages/*/package.json", "apps/*/package.json"],
  dependencyTypes: ["prod", "dev", "peer"],
  versionGroups: [
    {
      label: "React ecosystem",
      dependencies: [
        "react",
        "react-dom",
        "react-native",
        "@types/react",
        "@types/react-dom",
        "@types/react-native",
      ],
      packages: ["**"],
      policy: "sameRange",
    },
    {
      label: "Tooling",
      dependencies: ["typescript", "turbo", "@turbo/gen", "@tanstack/react-query", "zustand"],
      packages: ["**"],
      policy: "sameRange",
    },
  ],
  semverGroups: [
    {
      label: "Use exact versions for all dependencies",
      range: "",
    },
  ],
};

export default config;
