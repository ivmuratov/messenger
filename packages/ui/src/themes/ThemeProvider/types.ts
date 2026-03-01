import type { PropsWithChildren } from "react";

import type { Theme } from "../types";

export interface ThemeProviderProps extends PropsWithChildren {
  defaultTheme: Theme;
}
