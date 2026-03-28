import type { PropsWithChildren } from "react";

import type { FontWeightScale, TextSizeScale } from "@/shared/types";

export interface TypographyBaseProps extends PropsWithChildren {
  t?: TextSizeScale;
  fontWeight?: FontWeightScale;
}
