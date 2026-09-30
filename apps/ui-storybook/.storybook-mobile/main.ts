import path from "node:path";
import { fileURLToPath } from "node:url";

import { type StorybookConfig } from "@storybook/react-vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const stubsPath = path.resolve(dirname, "./stubs");

const RN_WEB_RESOLVE_EXTENSIONS = [
  ".web.js",
  ".mjs",
  ".js",
  ".mts",
  ".ts",
  ".jsx",
  ".tsx",
  ".json",
];

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/mobile/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
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
      conditions: ["react-native", "import", "module", "browser", "default"],
      extensions: RN_WEB_RESOLVE_EXTENSIONS,
      alias: {
        ...config.resolve?.alias,
        "react-native": "react-native-web",
        "react-native-reanimated": path.resolve(stubsPath, "reactNativeReanimated.ts"),
        "react-native-gesture-handler": path.resolve(stubsPath, "reactNativeGestureHandler.tsx"),
        "react-native-theme-switch-animation": path.resolve(
          stubsPath,
          "reactNativeThemeSwitchAnimation.ts"
        ),
        "react-native-worklets": path.resolve(stubsPath, "reactNativeWorklets.ts"),
        "react-native-edge-to-edge": path.resolve(stubsPath, "reactNativeEdgeToEdge.tsx"),
        "react-native-safe-area-context": path.resolve(stubsPath, "reactNativeSafeAreaContext.tsx"),
      },
    };

    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include ?? []), "lucide-react-native"],
      esbuildOptions: {
        ...config.optimizeDeps?.esbuildOptions,
        resolveExtensions: RN_WEB_RESOLVE_EXTENSIONS,
      },
    };

    config.define = {
      ...config.define,
      global: "globalThis",
      __DEV__: JSON.stringify(true),
    };

    return config;
  },
};

export default config;
