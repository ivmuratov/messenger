import clsx from "clsx";
import type { ElementType, ReactNode } from "react";

import type { TypographyBaseProps } from "../types";
import { fontWeightVariants, textSizeVariants } from "./Typography.css";

interface TypographyProps extends TypographyBaseProps {
  as?: ElementType;
}

export const Typography = ({
  children,
  as: Component = "span",
  t = "16_24",
  fontWeight = "regular",
}: TypographyProps): ReactNode => {
  return (
    <Component className={clsx(textSizeVariants[t], fontWeightVariants[fontWeight])}>
      {children}
    </Component>
  );
};
