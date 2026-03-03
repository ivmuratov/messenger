import { borderWidthToken, spacingToken } from "@/tokens";

export const headerRootStylesToken = {
  paddingLeft: spacingToken.md,
  paddingRight: spacingToken.md,
  paddingTop: spacingToken.sm,
  paddingBottom: spacingToken.sm,
  borderBottomWidth: borderWidthToken.xs,
  borderBottomStyle: "solid",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: 56,
} as const;

export const headerLeftStylesToken = {
  flexDirection: "row",
  alignItems: "center",
} as const;

export const headerCenterStylesToken = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
} as const;

export const headerRightStylesToken = {
  flexDirection: "row",
  alignItems: "center",
} as const;
