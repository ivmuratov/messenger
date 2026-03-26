import { style } from "@vanilla-extract/css";

import { theme } from "@/themes";

import {
  drawerLayoutAsideStylesToken,
  drawerLayoutMainStylesToken,
  drawerLayoutRootStylesToken,
} from "../tokens";

export const drawerLayoutRootStyles = style({
  ...drawerLayoutRootStylesToken,
  display: "flex",
  height: "100dvh",
});

export const drawerLayoutAsideStyles = style({
  ...drawerLayoutAsideStylesToken,
  backgroundColor: theme.background.secondary,
  borderRightColor: theme.border.primary,
  width: "300px",
  height: "100dvh",
  overflowY: "auto",
  scrollbarColor: `${theme.border.primary} transparent`,
  scrollbarWidth: "thin",
});

export const drawerLayoutMainStyles = style(drawerLayoutMainStylesToken);
