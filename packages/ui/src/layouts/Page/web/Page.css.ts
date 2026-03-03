import { style } from "@vanilla-extract/css";

import { theme } from "@/themes/ThemeProvider";

import { pageStylesToken } from "../tokens";

export const pageStyles = style({
  ...pageStylesToken,
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflowY: "auto",
  scrollbarGutter: "stable",
  scrollbarColor: `${theme.border.primary} transparent`,
  scrollbarWidth: "thin",
});
