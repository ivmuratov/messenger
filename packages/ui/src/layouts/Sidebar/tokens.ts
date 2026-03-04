import { borderWidthToken, spacingToken } from "@/tokens";

export const sidebarStylesToken = {
  paddingLeft: spacingToken.md,
  paddingRight: spacingToken.md,
  borderRightWidth: borderWidthToken.xs,
  borderRightStyle: "solid",
  paddingTop: spacingToken.sm,
  paddingBottom: spacingToken.sm,
} as const;
