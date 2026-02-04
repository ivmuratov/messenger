import { createTheme } from "@vanilla-extract/css";

import { theme } from "./theme.css";

export const light = createTheme(theme, {
  bg: {
    default: "#fafafa",
    subtle: "#ffffff",
    strong: "#111827",
  },
  fg: {
    default: "#111827",
    subtle: "#6b7280",
    strong: "#000000",
  },
  border: {
    default: "#e5e7eb",
    subtle: "#f3f4f6",
    strong: "#9ca3af",
  },
});
