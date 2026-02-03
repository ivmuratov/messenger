import { mergeConfig } from "tsdown";
import baseConfig from "./tsdown.base.config";

export default mergeConfig(baseConfig, {
  entry: ["src/index.native.ts"],
  outDir: "dist-native",
  external: ["react", "react-dom", "react-native"],
});
