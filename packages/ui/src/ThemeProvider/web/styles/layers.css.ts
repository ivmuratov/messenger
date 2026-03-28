import { globalLayer } from "@vanilla-extract/css";

// Порядок деклараций слоев важен - reset -> theme
export const resetLayer = globalLayer("reset");
export const themeLayer = globalLayer("theme");
