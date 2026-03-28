import type { PropsWithChildren } from "react";

import type { Theme } from "@/shared/types";

export interface ThemeProviderProps extends PropsWithChildren {
  defaultTheme: Theme;
}
