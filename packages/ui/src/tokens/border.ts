import type { BorderRadiusScale, BorderWidthScale } from "@/types";

export const borderWidthToken = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
} as const satisfies Record<BorderWidthScale, number>;

export const borderRadiusToken = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
} as const satisfies Record<BorderRadiusScale, number>;
