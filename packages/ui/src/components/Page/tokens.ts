import { borderWidthToken, spacingToken } from "@/shared/tokens";

export const pageHeaderStylesToken = {
  paddingLeft: spacingToken.md,
  paddingRight: spacingToken.md,
  paddingTop: spacingToken.sm,
  paddingBottom: spacingToken.sm,
  borderBottomWidth: borderWidthToken.xs,
  borderBottomStyle: "solid",
  minHeight: 56,
} as const;

export const pageBodyStylesToken = {
  paddingLeft: spacingToken.md,
  paddingRight: spacingToken.md,
} as const;
