import { style } from "@vanilla-extract/css";

import { theme } from "@/themes/ThemeProvider";

import { headerStylesToken } from "../tokens";

export const headerStyles = style({
  ...headerStylesToken,
  flexShrink: 0,
  borderBottomColor: theme.border.primary,
  backgroundColor: theme.background.secondary,
});
