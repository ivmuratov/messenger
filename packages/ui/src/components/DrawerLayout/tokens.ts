import { borderWidthToken, spacingToken } from "@/shared/tokens";

export const drawerLayoutRootStylesToken = {
  flexDirection: "row",
} as const;

export const drawerLayoutAsideStylesToken = {
  paddingLeft: spacingToken.md,
  paddingRight: spacingToken.md,
  borderRightWidth: borderWidthToken.xs,
  borderRightStyle: "solid",
  paddingTop: spacingToken.sm,
  paddingBottom: spacingToken.sm,
  flexShrink: 0,
} as const;

export const drawerLayoutMainStylesToken = {
  flex: 1,
  minWidth: 0,
} as const;
