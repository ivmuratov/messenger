import { borderWidthToken, spacingToken } from "@/tokens";

export const pageHeaderStylesToken = {
  paddingLeft: spacingToken.md,
  paddingRight: spacingToken.md,
  paddingTop: spacingToken.sm,
  paddingBottom: spacingToken.sm,
  borderBottomWidth: borderWidthToken.xs,
  borderBottomStyle: "solid",
  flexDirection: "row",
  alignItems: "center",
  minHeight: 56,
} as const;

export const pageBodyStylesToken = {
  paddingLeft: spacingToken.md,
  paddingRight: spacingToken.md,
} as const;
