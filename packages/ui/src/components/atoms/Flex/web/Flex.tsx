import clsx from "clsx";
import type { ReactNode } from "react";

import { spacingSprinkles } from "@/sprinkles";

import type { FlexPropsBase } from "../types";
import { flexVariants } from "./Flex.css";

export const Flex = ({
  children,
  direction = "column",
  justifyContent = "start",
  alignItems = "start",
  alignContent = "start",
  alignSelf = "start",
  ...spaceProps
}: FlexPropsBase): ReactNode => {
  return (
    <div
      className={clsx(
        flexVariants({
          direction,
          justifyContent,
          alignItems,
          alignContent,
          alignSelf,
        }),
        spacingSprinkles(spaceProps)
      )}
    >
      {children}
    </div>
  );
};
