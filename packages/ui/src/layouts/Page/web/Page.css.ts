import { style } from "@vanilla-extract/css";

import { theme } from "@/themes/ThemeProvider";

import { pageStylesToken } from "../tokens";

export const pageWrapperStyles = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  scrollbarColor: `${theme.border.primary} transparent`,
  scrollbarWidth: "thin",
});

export const pageStyles = style({
  ...pageStylesToken,
  maxWidth: "800px",
  marginLeft: "auto",
  marginRight: "auto",
  display: "flex",
  flexDirection: "column",
});
