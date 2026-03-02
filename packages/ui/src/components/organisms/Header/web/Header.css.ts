import { style } from "@vanilla-extract/css";

import { theme } from "@/themes/ThemeProvider";

import { headerStyleToken } from "../tokens";

export const headerStyles = style({
  ...headerStyleToken,
  flexShrink: 0,
  backgroundColor: theme.background.secondary,
});
