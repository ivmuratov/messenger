import { style } from "@vanilla-extract/css";

import { theme } from "@/themes/ThemeProvider";

import { headerStyleToken } from "../tokens";

export const headerStyles = style({
  ...headerStyleToken,
  flexShrink: 0,
  borderBottomColor: theme.border.primary,
  backgroundColor: theme.background.secondary,
});
