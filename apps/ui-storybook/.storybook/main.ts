import path from "node:path";
import { fileURLToPath } from "node:url";

import { type StorybookConfig } from "@storybook/react-vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const uiSrcPath = path.resolve(dirname, "../../../packages/ui/src");

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    const { vanillaExtractPlugin } = await import("@vanilla-extract/vite-plugin");
    const tsconfigPaths = (await import("vite-tsconfig-paths")).default;

    config.plugins = [
      ...(config.plugins ?? []),
      vanillaExtractPlugin(),
      tsconfigPaths({
        projects: [path.resolve(dirname, "../../../packages/ui/tsconfig.json")],
      }),
    ];

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@": uiSrcPath,
      },
    };

    return config;
  },
};

export default config;
