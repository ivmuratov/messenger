import { mergeConfig } from "tsdown";
import baseConfig from "./tsdown.base.config";

export default mergeConfig(baseConfig, {
  entry: ["src/index.native.ts"],
  outDir: "dist-native",
  external: [
    "react",
    "react-dom",
    "react-native",
    "react-native-safe-area-context",
    "react-native-theme-switch-animation",
    "react-native-edge-to-edge",
    "react-native-gesture-handler",
    "react-native-reanimated",
    "react-native-worklets",
  ],
});
