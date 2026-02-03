import { vanillaExtractPlugin } from "@vanilla-extract/rollup-plugin";
import { mergeConfig } from "tsdown";
import baseConfig from "./tsdown.base.config";

// FIXME: Убрать плагин, когда поправят - https://github.com/vanilla-extract-css/vanilla-extract/issues/1680
/** Удаляет импорты .vanilla.css из чанков (обход бага: плагин vanilla-extract не удаляет их при .mjs) */
function stripVanillaCssImports() {
  return {
    name: "strip-vanilla-css-imports",
    generateBundle(
      _options: unknown,
      bundle: Record<string, { type?: string; code?: string }>
    ) {
      for (const chunk of Object.values(bundle)) {
        if (chunk?.type === "chunk" && typeof chunk.code === "string") {
          chunk.code = chunk.code.replace(
            /^\s*import\s+["'][^"']*\.vanilla\.css["']\s*;?\s*\n?/gm,
            ""
          );
        }
      }
    },
  };
}

export default mergeConfig(baseConfig, {
  entry: ["src/index.ts"],
  outDir: "dist",
  external: ["react", "react-dom", "react-native", "@vanilla-extract/css"],
  plugins: [
    vanillaExtractPlugin({
      extract: {
        name: "index.css",
        sourcemap: false,
      },
    }),
    stripVanillaCssImports(),
  ],
  outputOptions(options) {
    return {
      ...options,
      assetFileNames: "index.css",
    };
  },
});
