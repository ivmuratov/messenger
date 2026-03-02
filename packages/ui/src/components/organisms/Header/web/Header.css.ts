import { style } from "@vanilla-extract/css";

import { theme } from "@/themes/ThemeProvider";

import { headerStyleToken } from "../tokens";

export const headerStyles = style({
  ...headerStyleToken,
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: theme.background.secondary,
});
