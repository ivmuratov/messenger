import { style } from "@vanilla-extract/css";

import { theme } from "./themes.css";

export const themeProviderStyles = style({
  height: "100dvh",
  overflowY: "auto",
  scrollbarColor: `${theme.border.primary} transparent`,
  scrollbarWidth: "thin",
});
