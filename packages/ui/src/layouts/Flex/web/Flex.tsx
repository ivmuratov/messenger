import clsx from "clsx";
import type { ElementType, ReactNode } from "react";

import { spacingSprinkles } from "@/sprinkles";

import type { FlexPropsBase } from "../types";
import { flexVariants } from "./Flex.css";

interface FlexProps extends FlexPropsBase {
  as?: ElementType;
  className?: string;
}

export const Flex = ({
  children,
  as: Component = "div",
  className,
  direction = "column",
  justifyContent,
  alignItems,
  alignContent,
  alignSelf,
  flexWrap,
  ...spaceProps
}: FlexProps): ReactNode => {
  return (
    <Component
      className={clsx(
        flexVariants({
          direction,
          justifyContent,
          alignItems,
          alignContent,
          alignSelf,
          flexWrap,
        }),
        spacingSprinkles(spaceProps),
        className
      )}
    >
      {children}
    </Component>
  );
};
