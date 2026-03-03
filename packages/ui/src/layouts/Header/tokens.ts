import { borderWidthToken, spacingToken } from "@/tokens";

export const headerStylesToken = {
  paddingLeft: spacingToken.md,
  paddingRight: spacingToken.md,
  paddingTop: spacingToken.sm,
  paddingBottom: spacingToken.sm,
  borderBottomWidth: borderWidthToken.xs,
  borderBottomStyle: "solid",
  minHeight: 56,
} as const;
