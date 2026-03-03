import { style } from "@vanilla-extract/css";

import { HEADER_Z_INDEX } from "@/constants";
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
  position: "sticky",
  top: 0,
  zIndex: HEADER_Z_INDEX,
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
