import clsx from "clsx";
import type { FC } from "react";

import { spacingSprinkles } from "@/sprinkles";

import type { FlexPropsBase } from "../types";
import { flexStyles } from "./Flex.css";

export const Flex: FC<FlexPropsBase> = ({
  children,
  direction = "column",
  justifyContent = "start",
  alignItems = "start",
  alignContent = "start",
  alignSelf = "start",
  ...spaceProps
}) => {
  return (
    <div
      className={clsx(
        flexStyles({
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
