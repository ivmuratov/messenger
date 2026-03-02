import type { PropsWithChildren } from "react";

import type { SpacingProps } from "@/types";

export interface FlexVariants {
  direction?: "row" | "column" | "rowReverse" | "columnReverse";
  justifyContent?: "center" | "end" | "start" | "spaceBetween" | "spaceAround" | "spaceEvenly";
  alignItems?: "center" | "end" | "start" | "stretch" | "baseline";
  alignContent?:
    | "center"
    | "start"
    | "end"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly"
    | "stretch";
  alignSelf?: "center" | "start" | "stretch" | "baseline" | "end";
  flexWrap?: "nowrap" | "wrap" | "wrapReverse";
}

export type FlexPropsBase = FlexVariants & SpacingProps & PropsWithChildren;
