import { createTheme } from "@vanilla-extract/css";

import { theme } from "./theme.css";

export const dark = createTheme(theme, {
  bg: {
    default: "#0f0f0f",
    subtle: "#1a1a1a",
    strong: "#f5f5f5",
  },
  fg: {
    default: "#f5f5f5",
    subtle: "#8b8b8b",
    strong: "#ffffff",
  },
  border: {
    default: "#2b2b2b",
    subtle: "#1f1f1f",
    strong: "#3f3f3f",
  },
});
