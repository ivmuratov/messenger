import { type PropsWithChildren } from "react";

import { type FontWeightScale, type TextSizeScale } from "@/shared/types";

export interface TypographyBaseProps extends PropsWithChildren {
  t?: TextSizeScale;
  fontWeight?: FontWeightScale;
}
