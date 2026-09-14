import { style } from "@vanilla-extract/css";

import { theme } from "@/shared/styles/themes.css";
import { transitionsToken } from "@/shared/tokens";

import {
  drawerLayoutAsideStylesToken,
  drawerLayoutMainStylesToken,
  drawerLayoutRootStylesToken,
} from "../tokens";
import { ASIDE_WIDTH_PX } from "./constants";

export const drawerLayoutRootStyles = style({
  ...drawerLayoutRootStylesToken,
  display: "flex",
  height: "100dvh",
  overflowX: "hidden",
});

export const drawerLayoutAsideStyles = style({
  ...drawerLayoutAsideStylesToken,
  backgroundColor: theme.background.secondary,
  borderRightColor: theme.border.primary,
  width: ASIDE_WIDTH_PX,
  height: "100dvh",
  overflowY: "auto",
  overflowX: "hidden",
  scrollbarColor: `${theme.border.primary} transparent`,
  scrollbarWidth: "thin",
  transform: "translateX(0)",
  marginRight: 0,
  transition: [
    `transform ${transitionsToken.durationMs}ms ease-out`,
    `margin-right ${transitionsToken.durationMs}ms ease-out`,
  ].join(", "),
  willChange: "transform",
});

export const drawerLayoutAsideCollapsedStyles = style({
  transform: "translateX(-100%)",
  marginRight: `-${ASIDE_WIDTH_PX}`,
});

export const drawerLayoutMainStyles = style(drawerLayoutMainStylesToken);
