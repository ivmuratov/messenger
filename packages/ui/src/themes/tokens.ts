import type { ThemeContract } from "./types";

export const lightThemeToken = {
  background: {
    primary: "#fafafa",
    secondary: "#ffffff",
  },
  foreground: {
    primary: "#111827",
    secondary: "#6b7280",
  },
  border: {
    primary: "#e5e7eb",
    secondary: "#f3f4f6",
  },
} as const satisfies ThemeContract;

export const darkThemeToken = {
  background: {
    primary: "#0f0f0f",
    secondary: "#1a1a1a",
  },
  foreground: {
    primary: "#f5f5f5",
    secondary: "#8b8b8b",
  },
  border: {
    primary: "#2b2b2b",
    secondary: "#1f1f1f",
  },
} as const satisfies ThemeContract;
