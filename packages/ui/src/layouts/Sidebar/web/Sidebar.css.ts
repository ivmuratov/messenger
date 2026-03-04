import { style } from "@vanilla-extract/css";

import { theme } from "@/themes";

import { sidebarStylesToken } from "../tokens";

export const sidebarStyles = style({
  ...sidebarStylesToken,
  backgroundColor: theme.background.secondary,
  borderRightColor: theme.border.primary,
  width: "300px",
  flexShrink: 0,
  height: "100dvh",
  overflowY: "auto",
  scrollbarColor: `${theme.border.primary} transparent`,
  scrollbarWidth: "thin",
});
