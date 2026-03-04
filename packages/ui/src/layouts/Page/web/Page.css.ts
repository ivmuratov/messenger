import { style } from "@vanilla-extract/css";

import { HEADER_Z_INDEX } from "@/constants";
import { theme } from "@/themes";

import { pageBodyStylesToken, pageHeaderStylesToken } from "../tokens";

export const pageHeaderStyles = style({
  ...pageHeaderStylesToken,
  display: "flex",
  position: "sticky",
  top: 0,
  zIndex: HEADER_Z_INDEX,
  borderBottomColor: theme.border.primary,
  backgroundColor: theme.background.secondary,
});

export const pageBodyStyles = style({
  ...pageBodyStylesToken,
  maxWidth: "800px",
  marginLeft: "auto",
  marginRight: "auto",
});

export const pageRootStyles = style({
  flex: 1,
  minWidth: 0,
  height: "100dvh",
  overflowY: "auto",
  scrollbarColor: `${theme.border.primary} transparent`,
  scrollbarWidth: "thin",
});
