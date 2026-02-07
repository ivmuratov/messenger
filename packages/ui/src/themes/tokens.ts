import type { ThemeContract } from "./types";

export const lightToken = {
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
} as const satisfies ThemeContract;

export const darkToken = {
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
} as const satisfies ThemeContract;
