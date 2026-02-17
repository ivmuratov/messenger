import type { PropsWithChildren } from "react";

import type { FontWeightScale, TextSizeScale } from "@/types";

export interface TypographyBaseProps extends PropsWithChildren {
  t?: TextSizeScale;
  fontWeight?: FontWeightScale;
}
