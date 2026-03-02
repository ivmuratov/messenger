import { style } from "@vanilla-extract/css";

import { theme } from "@/themes/ThemeProvider";

export const pageStyles = style({
  flex: 1,
  minHeight: 0,
  position: "relative",
  overflowY: "auto",
  scrollbarGutter: "stable",
  scrollbarColor: `${theme.border.primary} transparent`,
  scrollbarWidth: "thin",
});
