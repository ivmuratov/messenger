import { style } from "@vanilla-extract/css";

import { theme } from "@/shared/styles/themes.css";
import { zIndexToken } from "@/shared/tokens";

import { pageBodyStylesToken, pageHeaderStylesToken } from "../tokens";

export const pageHeaderStyles = style({
  ...pageHeaderStylesToken,
  display: "flex",
  position: "sticky",
  top: 0,
  zIndex: zIndexToken.header,
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
  height: "100dvh",
  overflowY: "auto",
  scrollbarColor: `${theme.border.primary} transparent`,
  scrollbarWidth: "thin",
});
