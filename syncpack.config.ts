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
        "react-native-web",
        "lucide-react-native",
        "react-native-safe-area-context",
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
    {
      label: "Testing",
      dependencies: [
        "vitest",
        "@testing-library/react",
        "jsdom",
        "msw",
        "@playwright/test",
      ],
      packages: ["**"],
      policy: "sameRange",
    },
    {
      label: "Storybook",
      dependencies: [
        "storybook",
        "@storybook/react-vite",
        "@storybook/react",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-themes",
        "@storybook/builder-vite",
        "chromatic",
      ],
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
