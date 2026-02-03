import type { PropsWithChildren } from "react";

export type Theme = "light" | "dark";

export interface ThemeProviderProps extends PropsWithChildren {
  defaultTheme: Theme;
}