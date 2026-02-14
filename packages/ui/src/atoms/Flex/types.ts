import type { PropsWithChildren } from "react";

import type { GapProps, SpacingProps } from "@/types";

export interface FlexVariants {
  direction?: "row" | "column" | "rowReverse" | "columnReverse";
  justifyContent?: "center" | "end" | "start" | "spaceBetween" | "spaceAround" | "spaceEvenly";
  alignItems?: "center" | "end" | "start";
  alignContent?: "center" | "start";
  alignSelf?: "center" | "start";
}

export type FlexPropsBase = FlexVariants & SpacingProps & GapProps & PropsWithChildren;
