import { style } from "@vanilla-extract/css";

import { theme } from "@/themes/ThemeProvider";

import {
  headerCenterStylesToken,
  headerLeftStylesToken,
  headerRightStylesToken,
  headerRootStylesToken,
} from "../tokens";

export const headerRootStyles = style({
  ...headerRootStylesToken,
  display: "flex",
  flexShrink: 0,
  borderBottomColor: theme.border.primary,
  backgroundColor: theme.background.secondary,
});

export const headerLeftStyles = style({
  ...headerLeftStylesToken,
  display: "flex",
});

export const headerCenterStyles = style({
  ...headerCenterStylesToken,
  display: "flex",
});

export const headerRightStyles = style({
  ...headerRightStylesToken,
  display: "flex",
});
