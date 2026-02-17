import clsx from "clsx";
import type { ElementType, FC } from "react";

import type { TypographyBaseProps } from "../types";
import { fontWeightStyles, textSizeStyles } from "./Typography.css";

interface TypographyProps extends TypographyBaseProps {
  as?: ElementType;
}

export const Typography: FC<TypographyProps> = ({
  children,
  as: Component = "span",
  t = "16_24",
  fontWeight = "regular",
}) => {
  return (
    <Component className={clsx(textSizeStyles[t], fontWeightStyles[fontWeight])}>
      {children}
    </Component>
  );
};
